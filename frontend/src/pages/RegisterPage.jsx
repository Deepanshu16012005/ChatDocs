import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Password strength calculator
    const getPasswordStrength = (password) => {
        if (!password) return { label: '', color: '', width: '0%' };
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { label: 'Weak', color: '#e24b4a', width: '33%' };
        if (score <= 3) return { label: 'Medium', color: '#ef9f27', width: '66%' };
        return { label: 'Strong', color: '#639922', width: '100%' };
    };

    const strength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validate = () => {
        if (!formData.name.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email address is required');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!termsAccepted) {
            setError('You must accept the Terms of Service to continue');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError('');

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/login', {
                state: { message: 'Account created successfully. Please sign in.' }
            });
        } catch (err) {
            const message = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d1a] flex">

            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-col justify-center items-center px-16 bg-[#16213e] border-r border-[#0f3460] w-1/2 text-center">
                <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
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

                <h2 className="text-3xl font-medium text-white leading-tight mb-4 max-w-sm">
                    Start chatting with your <span className="text-[#e94560]">documents</span> today
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-10 max-w-xs">
                    Create your free account and upload your first PDF in minutes. No credit card required.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    {[
                        { num: '1', text: 'Create your free account' },
                        { num: '2', text: 'Upload your PDF document' },
                        { num: '3', text: 'Ask questions and get cited answers' }
                    ].map((s) => (
                        <div
                            key={s.num}
                            className="flex items-center gap-4 bg-[#e94560]/08 border border-[#e94560]/20 rounded-xl px-4 py-3"
                        >
                            <div className="w-7 h-7 rounded-full bg-[#e94560] flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                                {s.num}
                            </div>
                            <span className="text-sm text-white/70 text-left">{s.text}</span>
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
                        <h1 className="text-2xl font-medium text-white mb-1">Create an account</h1>
                        <p className="text-sm text-white/50 mb-8">
                            Join ChatDocs and start chatting with your documents
                        </p>

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

                            {/* Full Name */}
                            <div className="mb-5">
                                <label className="block text-sm text-white/60 mb-2">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Deepanshu Jindal"
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0d0d1a] border border-[#0f3460] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e94560] transition-colors"
                                />
                            </div>

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
                            <div className="mb-5">
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

                                {/* Password Strength */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="h-1 bg-[#0f3460] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{
                                                    width: strength.width,
                                                    background: strength.color
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs mt-1" style={{ color: strength.color }}>
                                            {strength.label} password
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={(e) => {
                                        setTermsAccepted(e.target.checked);
                                        setError('');
                                    }}
                                    className="mt-0.5 accent-[#e94560] cursor-pointer"
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-xs text-white/40 leading-relaxed cursor-pointer"
                                >
                                    I agree to the{' '}
                                    <span className="text-[#e94560]">Terms of Service</span>
                                    {' '}and{' '}
                                    <span className="text-[#e94560]">Privacy Policy</span>
                                </label>
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
                                        Creating account...
                                    </span>
                                ) : 'Create account'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-[#0f3460]" />
                            <span className="text-xs text-white/30">or</span>
                            <div className="flex-1 h-px bg-[#0f3460]" />
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-sm text-white/40">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#e94560] hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;