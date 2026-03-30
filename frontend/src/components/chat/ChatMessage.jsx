import React from 'react';

const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="bg-[#e94560] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-sm leading-relaxed">
                    {message.content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start gap-2.5">
            <div className="w-7 h-7 bg-[#e94560] rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                C
            </div>
            <div>
                <div className="bg-[#16213e] border border-[#0f3460] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm max-w-md leading-relaxed text-white/85">
                    {message.content}
                </div>
                {message.sources && message.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {message.sources.map((source, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1 bg-[#e94560]/12 border border-[#e94560]/25 rounded-md px-2 py-0.5"
                            >
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z"/>
                                </svg>
                                <span className="text-[10px] text-[#e94560]">
                                    {source.filename} · Page {source.page}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;