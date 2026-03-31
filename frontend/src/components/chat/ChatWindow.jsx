import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import UploadModal from '../documents/UploadModal';
import { sendMessage, getChatHistory } from '../../api/chatApi';

const ChatWindow = ({
    activeSession,
    showUploadModal,
    onShowUploadModal,
    onDocumentUploaded,
    onSessionTitleUpdate
}) => {
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (activeSession) {
            loadChatHistory();
        } else {
            setMessages([]);
        }
    }, [activeSession]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadChatHistory = async () => {
        const sessionId = activeSession?.id || activeSession?._id;
        if (!sessionId) return;
        try {
            setLoadingHistory(true);
            const data = await getChatHistory(sessionId);
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Failed to load chat history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSendMessage = async (message) => {
        const sessionId = activeSession?.id || activeSession?._id;
        if (!sessionId) return;

        const userMessage = {
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setSending(true);

        try {
            const data = await sendMessage(message, sessionId);
            const aiMessage = {
                role: 'assistant',
                content: data.response,
                sources: data.sources || [],
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);
            if (data.session_title && onSessionTitleUpdate) {
                onSessionTitleUpdate(sessionId, data.session_title);
            }
        } catch (error) {
            const errorMessage = {
                role: 'assistant',
                content: error.response?.status === 429
                    ? 'Rate limit exceeded. Please wait 15 minutes before sending more messages.'
                    : 'Something went wrong. Please try again.',
                sources: [],
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setSending(false);
        }
    };

    if (!activeSession) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0d1a] relative">
                {showUploadModal && (
                    <UploadModal
                        onClose={() => onShowUploadModal(false)}
                        onDocumentUploaded={onDocumentUploaded}
                    />
                )}
                <div className="text-center px-6">
                    <div className="w-14 h-14 bg-[#e94560]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="1.5">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                    <p className="text-sm text-white/40 mb-6 max-w-xs">
                        Create a new chat session or select an existing one from the sidebar
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#0d0d1a] min-w-0 relative">
            {showUploadModal && (
                <UploadModal
                    onClose={() => onShowUploadModal(false)}
                    onDocumentUploaded={onDocumentUploaded}
                />
            )}

            {/* Chat Header */}
            <div className="px-5 py-3 border-b border-[#0f3460] bg-[#16213e] flex-shrink-0">
                <div className="text-sm font-medium truncate">
                    {activeSession.title || 'New Chat'}
                </div>
                <div className="text-xs text-white/40 mt-0.5">
                    {new Date(activeSession.createdAt).toLocaleDateString()}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                {loadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center">
                        <div className="w-12 h-12 bg-[#e94560]/15 rounded-xl flex items-center justify-center mb-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <p className="text-sm text-white/50 mb-1">No messages yet</p>
                        <p className="text-xs text-white/30">Ask a question about your uploaded documents</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <ChatMessage key={i} message={msg} />
                    ))
                )}

                {sending && (
                    <div className="flex justify-start gap-2.5">
                        <div className="w-7 h-7 bg-[#e94560] rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                            C
                        </div>
                        <div className="bg-[#16213e] border border-[#0f3460] rounded-2xl rounded-bl-sm px-4 py-3">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-white/40"
                                        style={{ animation: `bounceDot 1s infinite ${i * 0.2}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
                onSendMessage={handleSendMessage}
                onShowUpload={() => onShowUploadModal(true)}
                disabled={sending}
            />
        </div>
    );
};

export default ChatWindow;