import React, { useState, useRef } from 'react';

const ChatInput = ({ onSendMessage, onShowUpload, disabled }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const handleSend = () => {
        if (!message.trim() || disabled) return;
        onSendMessage(message.trim());
        setMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e) => {
        setMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    return (
        <div className="px-4 py-3 border-t border-[#0f3460] bg-[#16213e]">
            <div className="flex gap-2 items-end">
                {/* Upload button */}
                <button
                    onClick={onShowUpload}
                    title="Upload document"
                    className="w-9 h-9 flex items-center justify-center bg-[#0d0d1a] border border-[#0f3460] rounded-lg hover:border-[#e94560] hover:bg-[#e94560]/10 transition-all flex-shrink-0"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </button>

                {/* Text input */}
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about your documents..."
                    disabled={disabled}
                    rows={1}
                    className="flex-1 px-4 py-2.5 bg-[#0d0d1a] border border-[#0f3460] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e94560] transition-colors resize-none overflow-hidden disabled:opacity-50"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                />

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className="w-9 h-9 flex items-center justify-center bg-[#e94560] rounded-lg hover:bg-[#c73652] transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {disabled ? (
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                    )}
                </button>
            </div>
            <p className="text-[10px] text-white/20 mt-1.5 text-center">
                Press Enter to send · Shift+Enter for new line
            </p>
        </div>
    );
};

export default ChatInput;