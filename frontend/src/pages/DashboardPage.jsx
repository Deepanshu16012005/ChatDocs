import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SessionSidebar from '../components/sessions/SessionSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import DocumentPanel from '../components/documents/DocumentPanel';
import { getSessions, createSession } from '../api/sessionApi';
import { getDocuments } from '../api/documentApi';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [panelCollapsed, setPanelCollapsed] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Detect mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadSessions();
        loadDocuments();
    }, []);

    const loadSessions = async () => {
        try {
            setLoadingSessions(true);
            const data = await getSessions();
            setSessions(data.sessions);
            if (data.sessions.length > 0) {
                setActiveSession(data.sessions[0]);
            }
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setLoadingSessions(false);
        }
    };

    const loadDocuments = async () => {
        try {
            const data = await getDocuments();
            setDocuments(data.documents);
        } catch (error) {
            console.error('Failed to load documents:', error);
        }
    };

    const handleNewChat = async () => {
        try {
            const data = await createSession();
            const newSession = data.session;
            setSessions(prev => [newSession, ...prev]);
            setActiveSession(newSession);
        } catch (error) {
            console.error('Failed to create session:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDocumentUploaded = (newDocument) => {
        setDocuments(prev => [newDocument, ...prev]);
        setShowUploadModal(false);
    };

    const handleSessionTitleUpdate = (sessionId, newTitle) => {
        setSessions(prev =>
            prev.map(s => (s.id === sessionId || s._id === sessionId)
                ? { ...s, title: newTitle }
                : s
            )
        );
        if (activeSession?.id === sessionId || activeSession?._id === sessionId) {
            setActiveSession(prev => ({ ...prev, title: newTitle }));
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0d0d1a] text-white overflow-hidden">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-4 bg-[#16213e] border-b border-[#0f3460] flex-shrink-0 z-10" style={{ height: '52px' }}>
                <div className="flex items-center gap-3">
                    {/* Hamburger on mobile */}
                    {isMobile && (
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 mr-1"
                        >
                            <div className="w-5 h-0.5 bg-white/60 rounded" />
                            <div className="w-5 h-0.5 bg-white/60 rounded" />
                            <div className="w-5 h-0.5 bg-white/60 rounded" />
                        </button>
                    )}
                    <div className="w-7 h-7 bg-[#e94560] rounded-lg flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                    </div>
                    <span className="text-base font-medium">ChatDocs</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#e94560] flex items-center justify-center text-xs font-medium">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 border border-[#0f3460] rounded-lg text-xs text-white/50 hover:border-[#e94560] hover:text-[#e94560] transition-all"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">

                {/* Desktop Sidebar */}
                {!isMobile && (
                    <SessionSidebar
                        sessions={sessions}
                        activeSession={activeSession}
                        collapsed={sidebarCollapsed}
                        loading={loadingSessions}
                        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                        onSelectSession={setActiveSession}
                        onNewChat={handleNewChat}
                        onTitleUpdate={handleSessionTitleUpdate}
                        documents={documents}
                        onDocumentUploaded={handleDocumentUploaded}
                        isMobile={false}
                        mobileOpen={false}
                        onMobileClose={() => {}}
                    />
                )}

                {/* Mobile Sidebar */}
                {isMobile && (
                    <SessionSidebar
                        sessions={sessions}
                        activeSession={activeSession}
                        collapsed={false}
                        loading={loadingSessions}
                        onCollapse={() => {}}
                        onSelectSession={setActiveSession}
                        onNewChat={handleNewChat}
                        onTitleUpdate={handleSessionTitleUpdate}
                        documents={documents}
                        onDocumentUploaded={handleDocumentUploaded}
                        isMobile={true}
                        mobileOpen={mobileSidebarOpen}
                        onMobileClose={() => setMobileSidebarOpen(false)}
                    />
                )}

                {/* Chat Window */}
                <ChatWindow
                    activeSession={activeSession}
                    showUploadModal={showUploadModal}
                    onShowUploadModal={setShowUploadModal}
                    onDocumentUploaded={handleDocumentUploaded}
                />

                {/* Right Document Panel - desktop only */}
                {!isMobile && (
                    <DocumentPanel
                        documents={documents}
                        collapsed={panelCollapsed}
                        onCollapse={() => setPanelCollapsed(!panelCollapsed)}
                        showUploadModal={showUploadModal}
                        onShowUploadModal={setShowUploadModal}
                        onDocumentUploaded={handleDocumentUploaded}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardPage;