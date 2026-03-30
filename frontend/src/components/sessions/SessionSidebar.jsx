import React, { useState } from 'react';
import { updateSessionTitle } from '../../api/sessionApi';

const SessionSidebar = ({
    sessions,
    activeSession,
    collapsed,
    loading,
    onCollapse,
    onSelectSession,
    onNewChat,
    onTitleUpdate
}) => {
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

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

    return (
        <div
            className="flex flex-col bg-[#16213e] border-r border-[#0f3460] flex-shrink-0 transition-all duration-300 overflow-hidden"
            style={{ width: collapsed ? '48px' : '220px' }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 p-2.5 border-b border-[#0f3460] flex-shrink-0">
                {!collapsed && (
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
                )}
                {collapsed && (
                    <button
                        onClick={onNewChat}
                        className="w-7 h-7 flex items-center justify-center bg-[#e94560] rounded-lg hover:bg-[#c73652] transition-all mx-auto"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </button>
                )}
                <button
                    onClick={onCollapse}
                    className="w-6 h-6 flex items-center justify-center border border-[#0f3460] rounded-md hover:border-[#e94560] transition-all flex-shrink-0"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                        {collapsed
                            ? <polyline points="9 18 15 12 9 6"/>
                            : <polyline points="15 18 9 12 15 6"/>
                        }
                    </svg>
                </button>
            </div>

            {/* Session List */}
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
                            <div className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider">
                                Recent
                            </div>
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
                                            isActive
                                                ? 'bg-[#e94560]/10 border-[#e94560]'
                                                : 'border-transparent hover:bg-white/5'
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
                                                <div className="text-xs text-white/80 truncate mb-0.5">
                                                    {session.title || 'New Chat'}
                                                </div>
                                                <div className="text-[10px] text-white/30">
                                                    {new Date(session.createdAt).toLocaleDateString()}
                                                </div>
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