import React, { useState } from 'react';
import { updateSessionTitle } from '../../api/sessionApi';
import { uploadDocument } from '../../api/documentApi';
import UploadModal from '../documents/UploadModal';

const SessionSidebar = ({
    sessions,
    activeSession,
    collapsed,
    loading,
    onCollapse,
    onSelectSession,
    onNewChat,
    onTitleUpdate,
    documents,
    onDocumentUploaded,
    isMobile,
    mobileOpen,
    onMobileClose
}) => {
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [activeTab, setActiveTab] = useState('chats');
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleDoubleClick = (session) => {
        setEditingId(session.id || session._id);
        setEditTitle(session.title);
    };

    const handleTitleSave = async (sessionId) => {
        if (!editTitle.trim()) {
            setEditingId(null);
            return;
        }
        try {
            await updateSessionTitle(sessionId, editTitle);
            onTitleUpdate(sessionId, editTitle);
        } catch (error) {
            console.error('Failed to update title:', error);
        } finally {
            setEditingId(null);
        }
    };

    const handleSessionClick = (session) => {
        onSelectSession(session);
        if (isMobile) onMobileClose();
    };

    // Mobile drawer
    if (isMobile) {
        return (
            <>
                {mobileOpen && (
                    <div className="fixed inset-0 z-30 flex">
                        {/* Drawer */}
                        <div className="w-64 bg-[#16213e] border-r border-[#0f3460] flex flex-col h-full z-40">
                            {/* Tabs */}
                            <div className="flex border-b border-[#0f3460] flex-shrink-0">
                                <button
                                    onClick={() => setActiveTab('chats')}
                                    className={`flex-1 py-3 text-xs font-medium transition-all ${
                                        activeTab === 'chats'
                                            ? 'text-[#e94560] border-b-2 border-[#e94560]'
                                            : 'text-white/40'
                                    }`}
                                >
                                    Chats
                                </button>
                                <button
                                    onClick={() => setActiveTab('documents')}
                                    className={`flex-1 py-3 text-xs font-medium transition-all ${
                                        activeTab === 'documents'
                                            ? 'text-[#e94560] border-b-2 border-[#e94560]'
                                            : 'text-white/40'
                                    }`}
                                >
                                    Documents
                                </button>
                            </div>

                            {/* Chats Tab */}
                            {activeTab === 'chats' && (
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <div className="p-2 border-b border-[#0f3460]">
                                        <button
                                            onClick={() => { onNewChat(); onMobileClose(); }}
                                            className="w-full py-2 bg-[#e94560] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-[#c73652] transition-all"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                <line x1="12" y1="5" x2="12" y2="19"/>
                                                <line x1="5" y1="12" x2="19" y2="12"/>
                                            </svg>
                                            New chat
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        {loading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2">
                                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                                </svg>
                                            </div>
                                        ) : sessions.length === 0 ? (
                                            <div className="px-4 py-6 text-center">
                                                <p className="text-xs text-white/30">No sessions yet</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider">Recent</div>
                                                {sessions.map(session => {
                                                    const id = session.id || session._id;
                                                    const isActive = (activeSession?.id || activeSession?._id) === id;
                                                    return (
                                                        <div
                                                            key={id}
                                                            onClick={() => handleSessionClick(session)}
                                                            className={`px-3 py-2 cursor-pointer border-l-2 transition-all ${
                                                                isActive ? 'bg-[#e94560]/10 border-[#e94560]' : 'border-transparent hover:bg-white/5'
                                                            }`}
                                                        >
                                                            <div className="text-xs text-white/80 truncate mb-0.5">{session.title || 'New Chat'}</div>
                                                            <div className="text-[10px] text-white/30">{new Date(session.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Documents Tab */}
                            {activeTab === 'documents' && (
                                <div className="flex-1 overflow-y-auto">
                                    <div
                                        onClick={() => setShowUploadModal(true)}
                                        className="mx-3 my-3 border-2 border-dashed border-[#0f3460] rounded-xl p-4 text-center cursor-pointer hover:border-[#e94560] transition-all"
                                    >
                                        <div className="w-8 h-8 bg-[#e94560]/12 rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2">
                                                <polyline points="16 16 12 12 8 16"/>
                                                <line x1="12" y1="12" x2="12" y2="21"/>
                                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                                            </svg>
                                        </div>
                                        <p className="text-xs font-medium mb-0.5">Upload PDF</p>
                                        <p className="text-[10px] text-white/40">Click or drag and drop</p>
                                    </div>

                                    {documents && documents.length > 0 && (
                                        <>
                                            <div className="px-3 pb-2 text-[10px] text-white/30 uppercase tracking-wider">Uploaded</div>
                                            {documents.map((doc, i) => (
                                                <div key={doc._id || i} className="mx-2.5 mb-2 px-3 py-2 bg-[#0d0d1a] border border-[#0f3460] rounded-lg">
                                                    <p className="text-xs text-white/80 truncate">{doc.filename}</p>
                                                    <p className="text-[10px] text-white/30 mt-0.5">{(doc.filesize / 1024 / 1024).toFixed(1)} MB</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${doc.processingStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                        <span className={`text-[10px] ${doc.processingStatus === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                            {doc.processingStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Overlay */}
                        <div
                            className="flex-1 bg-black/50"
                            onClick={onMobileClose}
                        />
                    </div>
                )}

                {showUploadModal && (
                    <UploadModal
                        onClose={() => setShowUploadModal(false)}
                        onDocumentUploaded={(doc) => {
                            onDocumentUploaded(doc);
                            setShowUploadModal(false);
                        }}
                    />
                )}
            </>
        );
    }

    // Desktop sidebar
    return (
        <div
            className="flex flex-col bg-[#16213e] border-r border-[#0f3460] flex-shrink-0 transition-all duration-300 overflow-hidden"
            style={{ width: collapsed ? '48px' : '220px' }}
        >
            {/* Header */}
            <div className={`flex items-center border-b border-[#0f3460] flex-shrink-0 ${collapsed ? 'justify-center p-2.5' : 'gap-2 p-2.5'}`}>
                {collapsed ? (
                    // Only hamburger when collapsed
                    <button
                        onClick={onCollapse}
                        className="w-7 h-7 flex flex-col items-center justify-center gap-1 hover:opacity-70 transition-all"
                        title="Open sidebar"
                    >
                        <div className="w-4 h-0.5 bg-white/60 rounded" />
                        <div className="w-4 h-0.5 bg-white/60 rounded" />
                        <div className="w-4 h-0.5 bg-white/60 rounded" />
                    </button>
                ) : (
                    // New chat + collapse arrow when expanded
                    <>
                        <button
                            onClick={onNewChat}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#e94560] rounded-lg text-xs font-medium hover:bg-[#c73652] transition-all"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            New chat
                        </button>
                        <button
                            onClick={onCollapse}
                            className="w-7 h-7 flex flex-col items-center justify-center gap-1 hover:opacity-70 transition-all flex-shrink-0"
                            title="Collapse sidebar"
                        >
                            <div className="w-4 h-0.5 bg-white/60 rounded" />
                            <div className="w-4 h-0.5 bg-white/60 rounded" />
                            <div className="w-4 h-0.5 bg-white/60 rounded" />
                        </button>
                    </>
                )}
            </div>

            {/* Session List - only when expanded */}
            {!collapsed && (
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                            </svg>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                            <p className="text-xs text-white/30">No sessions yet</p>
                            <p className="text-xs text-white/20 mt-1">Click New chat to start</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider">Recent</div>
                            {sessions.map(session => {
                                const id = session.id || session._id;
                                const isActive = (activeSession?.id || activeSession?._id) === id;
                                const isEditing = editingId === id;

                                return (
                                    <div
                                        key={id}
                                        onClick={() => onSelectSession(session)}
                                        onDoubleClick={() => handleDoubleClick(session)}
                                        className={`px-3 py-2 cursor-pointer border-l-2 transition-all ${
                                            isActive ? 'bg-[#e94560]/10 border-[#e94560]' : 'border-transparent hover:bg-white/5'
                                        }`}
                                    >
                                        {isEditing ? (
                                            <input
                                                autoFocus
                                                value={editTitle}
                                                onChange={e => setEditTitle(e.target.value)}
                                                onBlur={() => handleTitleSave(id)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') handleTitleSave(id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                onClick={e => e.stopPropagation()}
                                                className="w-full bg-[#0d0d1a] border border-[#e94560] rounded px-2 py-0.5 text-xs text-white outline-none"
                                            />
                                        ) : (
                                            <>
                                                <div className="text-xs text-white/80 truncate mb-0.5">{session.title || 'New Chat'}</div>
                                                <div className="text-[10px] text-white/30">{new Date(session.createdAt).toLocaleDateString()}</div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SessionSidebar;