import React, { useState, useRef } from 'react';
import { uploadDocument } from '../../api/documentApi';

const UploadModal = ({ onClose, onDocumentUploaded }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are supported');
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size exceeds 10MB limit');
            return;
        }
        setFile(selectedFile);
        setError('');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileSelect(droppedFile);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const data = await uploadDocument(file);
            onDocumentUploaded(data.document);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-[#16213e] border border-[#0f3460] rounded-2xl p-6 w-80">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-medium">Upload document</h3>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <p className="text-xs text-white/40 mb-4">PDF files only · Max 10MB</p>

                {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="text-xs text-red-400">{error}</span>
                    </div>
                )}

                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4 ${
                        dragOver
                            ? 'border-[#e94560] bg-[#e94560]/5'
                            : file
                            ? 'border-green-500/50 bg-green-500/5'
                            : 'border-[#0f3460] hover:border-[#e94560]'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={e => handleFileSelect(e.target.files[0])}
                    />
                    {file ? (
                        <>
                            <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </div>
                            <p className="text-sm text-white/80 font-medium">{file.name}</p>
                            <p className="text-xs text-white/40 mt-1">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 bg-[#e94560]/12 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2">
                                    <polyline points="16 16 12 12 8 16"/>
                                    <line x1="12" y1="12" x2="12" y2="21"/>
                                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                                </svg>
                            </div>
                            <p className="text-sm font-medium mb-1">Drop your PDF here</p>
                            <p className="text-xs text-white/40">or click to browse files</p>
                        </>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 border border-[#0f3460] rounded-lg text-xs text-white/50 hover:border-[#e94560] hover:text-[#e94560] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="flex-1 py-2 bg-[#e94560] rounded-lg text-xs font-medium text-white hover:bg-[#c73652] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center gap-1.5">
                                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                                Uploading...
                            </span>
                        ) : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;