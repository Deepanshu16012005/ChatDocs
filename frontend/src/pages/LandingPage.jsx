import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    // Particle animation
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.r = Math.random() * 2 + 1;
                this.isRed = Math.random() > 0.7;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.isRed ? '#e94560' : 'rgba(255,255,255,0.6)';
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = [];
            for (let i = 0; i < 60; i++) {
                particles.push(new Particle());
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(233,69,96,${0.15 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animationId = requestAnimationFrame(draw);
        };

        init();
        draw();
        window.addEventListener('resize', init);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', init);
        };
    }, []);

    return (
        <div className="bg-[#0d0d1a] min-h-screen text-white overflow-x-hidden">

            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

                {/* Navbar */}
                <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-10 py-5 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#e94560] rounded-lg flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                        </div>
                        <span className="text-lg font-medium">ChatDocs</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 border border-white/20 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-all"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-4 py-2 bg-[#e94560] rounded-lg text-sm font-medium hover:bg-[#c73652] transition-all"
                        >
                            Get started
                        </button>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Badge */}
                    <div className="flex items-center gap-2 bg-[#e94560]/15 border border-[#e94560]/30 rounded-full px-4 py-1.5 text-xs text-[#e94560] mb-6">
                        <div className="w-2 h-2 rounded-full bg-[#e94560] animate-pulse" />
                        Powered by Groq + Gemini + Cohere
                    </div>

                    <h1 className="text-4xl md:text-6xl font-medium leading-tight mb-5 max-w-3xl">
                        Chat with your documents
                        <br />
                        using <span className="text-[#e94560]">AI that understands</span>
                    </h1>

                    <p className="text-sm md:text-base text-white/60 max-w-lg leading-relaxed mb-8">
                        Upload your PDFs and get instant, accurate answers. Powered by hybrid RAG with source citations so you always know where the answer came from.
                    </p>

                    <div className="flex gap-4 flex-wrap justify-center mb-12">
                        <button
                            onClick={() => navigate('/register')}
                            className="px-7 py-3 bg-[#e94560] rounded-xl text-sm font-medium hover:bg-[#c73652] hover:-translate-y-0.5 transition-all"
                        >
                            Start for free
                        </button>
                        <button
                            onClick={() => window.open('https://github.com/Deepanshu16012005/ChatDocs', '_blank')}
                            className="px-7 py-3 border border-white/20 rounded-xl text-sm hover:border-[#e94560] hover:text-[#e94560] transition-all"
                        >
                            View on GitHub
                        </button>
                    </div>

                    {/* Chat Mockup */}
                    <ChatMockup />
                </div>
            </div>

            {/* Features Section */}
            <FeaturesSection />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Tech Stack Section */}
            <TechStackSection />

            {/* Footer */}
            <Footer />
        </div>
    );
};

const ChatMockup = () => (
    <div className="bg-[#16213e] border border-[#0f3460] rounded-2xl p-5 max-w-md w-full text-left">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b border-[#0f3460]">
            <div className="w-8 h-8 bg-[#e94560] rounded-lg flex items-center justify-center text-sm font-medium">C</div>
            <div>
                <div className="text-sm font-medium">ChatDocs AI</div>
                <div className="text-xs text-white/40">lecture_notes.pdf</div>
            </div>
        </div>

        <div className="flex justify-end mb-3">
            <div className="bg-[#e94560] rounded-2xl rounded-br-sm px-4 py-2.5 text-xs max-w-xs">
                What is a Binary Search Tree?
            </div>
        </div>

        <div className="flex justify-start mb-3">
            <div>
                <div className="bg-[#0f3460] rounded-2xl rounded-bl-sm px-4 py-2.5 text-xs text-white/90 max-w-sm leading-relaxed">
                    A Binary Search Tree is a node-based data structure where each node has at most two children. Left child contains values less than the parent, right child contains greater values.
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 bg-[#e94560]/15 border border-[#e94560]/30 rounded-md px-2 py-1 w-fit">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z"/>
                    </svg>
                    <span className="text-[10px] text-[#e94560]">lecture_notes.pdf · Page 42</span>
                </div>
            </div>
        </div>

        <div className="flex gap-1.5 px-4 py-2.5 bg-[#0f3460] rounded-2xl w-fit">
            {[0, 1, 2].map(i => (
                <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/40"
                    style={{ animation: `bounceDot 1s infinite ${i * 0.2}s` }}
                />
            ))}
        </div>
    </div>
);

const FeaturesSection = () => {
    const features = [
        {
            color: '#e94560',
            bg: 'rgba(233,69,96,0.15)',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
            ),
            name: 'Hybrid search',
            desc: 'Combines BM25 sparse vectors and Gemini dense embeddings for best-of-both retrieval'
        },
        {
            color: '#639922',
            bg: 'rgba(99,153,34,0.15)',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
            ),
            name: 'Cohere reranking',
            desc: 'Cross-encoder reranking using rerank-v3.5 for maximum answer relevance'
        },
        {
            color: '#378add',
            bg: 'rgba(55,138,221,0.15)',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#378add" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            ),
            name: 'Source citations',
            desc: 'Every answer includes the exact page number and filename it came from'
        },
        {
            color: '#7f77dd',
            bg: 'rgba(127,119,221,0.15)',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
            ),
            name: 'Data privacy',
            desc: 'Pinecone queries filtered by user ID so your documents are always private'
        }
    ];

    return (
        <div className="bg-[#0d0d1a] py-16 px-6">
            <h2 className="text-center text-2xl md:text-3xl font-medium mb-2">Everything you need</h2>
            <p className="text-center text-sm text-white/50 mb-10">Built with a production-grade hybrid RAG pipeline</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="bg-[#16213e] border border-[#0f3460] rounded-2xl p-6 hover:border-[#e94560] hover:-translate-y-1 transition-all duration-300 cursor-default"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
                            {f.icon}
                        </div>
                        <div className="text-sm font-medium mb-2">{f.name}</div>
                        <div className="text-xs text-white/50 leading-relaxed">{f.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HowItWorksSection = () => {
    const steps = [
        {
            num: '1',
            title: 'Upload your PDF',
            desc: 'Drop your document and our pipeline chunks, embeds and indexes it automatically'
        },
        {
            num: '2',
            title: 'Ask anything',
            desc: 'Type your question in plain English. Groq reformulates it for maximum retrieval accuracy'
        },
        {
            num: '3',
            title: 'Get cited answers',
            desc: 'Receive accurate answers grounded in your document with page number citations'
        }
    ];

    return (
        <div className="bg-[#16213e] py-16 px-6">
            <h2 className="text-center text-2xl md:text-3xl font-medium mb-2">How it works</h2>
            <p className="text-center text-sm text-white/50 mb-12">Three steps to instant answers from your documents</p>
            <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto justify-center">
                {steps.map((s, i) => (
                    <div key={i} className="flex-1 text-center px-4">
                        <div className="relative w-12 h-12 rounded-full bg-[#e94560] flex items-center justify-center text-lg font-medium mx-auto mb-4">
                            {s.num}
                            <div
                                className="absolute w-16 h-16 border border-[#e94560]/30 rounded-full"
                                style={{ animation: 'ripple 2s infinite' }}
                            />
                        </div>
                        <div className="text-sm font-medium mb-2">{s.title}</div>
                        <div className="text-xs text-white/50 leading-relaxed">{s.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TechStackSection = () => {
    const pills = [
        { label: 'React.js', color: '#e94560' },
        { label: 'Node.js + Express', color: '#639922' },
        { label: 'FastAPI + Python', color: '#378add' },
        { label: 'MongoDB Atlas', color: '#7f77dd' },
        { label: 'Pinecone', color: '#1d9e75' },
        { label: 'Groq LLaMA 3.1', color: '#ef9f27' },
        { label: 'Google Gemini', color: '#d85a30' },
        { label: 'Cohere Rerank', color: '#d4537e' },
        { label: 'Docker', color: '#888780' },
    ];

    return (
        <div className="bg-[#0d0d1a] py-14 px-6">
            <h2 className="text-center text-2xl md:text-3xl font-medium mb-2">Built with</h2>
            <p className="text-center text-sm text-white/50 mb-8">Industry-grade tools powering every response</p>
            <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
                {pills.map((p, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 bg-[#16213e] border border-[#0f3460] rounded-full px-4 py-2 text-xs text-white/70 hover:border-[#e94560] hover:text-white transition-all cursor-default"
                    >
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        {p.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Footer = () => (
    <div className="bg-[#16213e] border-t border-[#0f3460] py-6 px-6 text-center text-xs text-white/40">
        Built by{' '}
        <a
            href="https://github.com/Deepanshu16012005"
            target="_blank"
            rel="noreferrer"
            className="text-[#e94560] hover:underline"
        >
            Deepanshu Jindal
        </a>
        {' · '}
        <a
            href="https://github.com/Deepanshu16012005/ChatDocs"
            target="_blank"
            rel="noreferrer"
            className="text-[#e94560] hover:underline"
        >
            GitHub
        </a>
    </div>
);

export default LandingPage;