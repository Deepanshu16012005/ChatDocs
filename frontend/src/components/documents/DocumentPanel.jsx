import React from 'react';

const DocumentPanel = ({
    documents,
    collapsed,
    onCollapse,
    onShowUploadModal
}) => {
    return (
        <div className="flex">
            <div
                className="flex flex-col bg-[#16213e] border-l border-[#0f3460] flex-shrink-0 transition-all duration-300 overflow-hidden"
                style={{ width: collapsed ? '0px' : '240px' }}
            >
                {!collapsed && (
                    <>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f3460] flex-shrink-0">
                            <span className="text-sm font-medium">Documents</span>
                            <button
                                onClick={onCollapse}
                                className="w-6 h-6 flex items-center justify-center border border-[#0f3460] rounded-md hover:border-[#e94560] transition-all"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {/* Upload Zone */}
                            <div
                                onClick={() => onShowUploadModal(true)}
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
                                <p className="text-[10px] text-white/30">Max 10MB</p>
                            </div>

                            {/* Document List */}
                            {documents.length > 0 && (
                                <>
                                    <div className="px-4 pb-2 text-[10px] text-white/30 uppercase tracking-wider">
                                        Uploaded documents
                                    </div>
                                    {documents.map((doc, i) => (
                                        <div
                                            key={doc._id || doc.id || i}
                                            className="mx-2.5 mb-2 px-3 py-2 bg-[#0d0d1a] border border-[#0f3460] rounded-lg hover:border-[#e94560] transition-all cursor-default"
                                        >
                                            <div className="flex items-start gap-2">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                    <polyline points="14 2 14 8 20 8"/>
                                                </svg>
                                                <div className="min-w-0">
                                                    <p className="text-xs text-white/80 truncate">{doc.filename}</p>
                                                    <p className="text-[10px] text-white/30 mt-0.5">
                                                        {(doc.filesize / 1024 / 1024).toFixed(1)} MB
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                                            doc.processingStatus === 'completed'
                                                                ? 'bg-green-500'
                                                                : doc.processingStatus === 'processing'
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                        }`} />
                                                        <span className={`text-[10px] ${
                                                            doc.processingStatus === 'completed'
                                                                ? 'text-green-500'
                                                                : doc.processingStatus === 'processing'
                                                                ? 'text-yellow-500'
                                                                : 'text-red-500'
                                                        }`}>
                                                            {doc.processingStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {documents.length === 0 && (
                                <div className="px-4 py-4 text-center">
                                    <p className="text-xs text-white/30">No documents uploaded yet</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Show panel button when collapsed */}
            {collapsed && (
                <button
                    onClick={onCollapse}
                    className="w-7 h-full bg-[#16213e] border-l border-[#0f3460] flex items-center justify-center hover:bg-[#e94560]/10 transition-all"
                    title="Show documents"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default DocumentPanel;
