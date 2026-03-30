import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.error || 'Login failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d1a] flex">

            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-col justify-center items-center px-16 bg-[#16213e] border-r border-[#0f3460] w-1/2">
                <Link to="/" className="flex items-center gap-3 mb-12">
                    <div className="w-8 h-8 bg-[#e94560] rounded-lg flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    </div>
                    <span className="text-lg font-medium text-white">ChatDocs</span>
                </Link>

                <div className="flex items-center gap-2 bg-[#e94560]/15 border border-[#e94560]/30 rounded-full px-4 py-1.5 text-xs text-[#e94560] mb-6 w-fit">
                    <div className="w-2 h-2 rounded-full bg-[#e94560] animate-pulse" />
                    Powered by Groq + Gemini + Cohere
                </div>

                <h2 className="text-3xl text-center font-medium text-white leading-tight mb-4">
                    Chat with your <span className="text-[#e94560]">documents</span> using AI
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-10">
                    Upload your PDFs and get instant, accurate answers powered by a hybrid RAG pipeline.
                </p>

                <div className="flex flex-col gap-4">
                    {[
                        'Hybrid search with BM25 and Gemini embeddings',
                        'Cohere reranking for maximum relevance',
                        'Source citations with page numbers',
                        'Persistent chat history per session'
                    ].map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#e94560] flex-shrink-0" />
                            <span className="text-sm text-white/50">{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-[#e94560] rounded-lg flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-white">ChatDocs</span>
                    </Link>

                    <div className="bg-[#16213e] border border-[#0f3460] rounded-2xl p-8">
                        <h1 className="text-2xl font-medium text-white mb-1">Welcome back</h1>
                        <p className="text-sm text-white/50 mb-8">Sign in to your ChatDocs account</p>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span className="text-xs text-red-400">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="mb-5">
                                <label className="block text-sm text-white/60 mb-2">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0d0d1a] border border-[#0f3460] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e94560] transition-colors"
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-6">
                                <label className="block text-sm text-white/60 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-4 py-2.5 bg-[#0d0d1a] border border-[#0f3460] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e94560] transition-colors pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-[#e94560] rounded-lg text-sm font-medium text-white hover:bg-[#c73652] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : 'Sign in'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-[#0f3460]" />
                            <span className="text-xs text-white/30">or</span>
                            <div className="flex-1 h-px bg-[#0f3460]" />
                        </div>

                        {/* Register Link */}
                        <p className="text-center text-sm text-white/40">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#e94560] hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;