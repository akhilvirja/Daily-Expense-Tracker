import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { Toast } from '../components/ui/Toast';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Password strength calculation
    const getPasswordStrength = (pw: string): { score: number; label: string; color: string } => {
        let score = 0;
        if (pw.length >= 6) score++;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;

        if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
        if (score <= 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
        if (score <= 3) return { score: 3, label: 'Good', color: '#10b981' };
        return { score: 4, label: 'Strong', color: '#06d6a0' };
    };

    const strength = password.length > 0 ? getPasswordStrength(password) : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await authApi.register({ fullName, email, password });
            if (res.success && res.data) {
                login(res.data.token, {
                    id: res.data.id,
                    fullName: res.data.fullName,
                    email: res.data.email,
                });
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes auth-gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes auth-float-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.05); }
                    66% { transform: translate(-20px, 20px) scale(0.95); }
                }
                @keyframes auth-float-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-40px, 30px) scale(1.1); }
                    66% { transform: translate(25px, -40px) scale(0.9); }
                }
                @keyframes auth-float-3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(20px, 40px) scale(0.95); }
                    66% { transform: translate(-30px, -30px) scale(1.08); }
                }
                @keyframes auth-card-enter {
                    from { opacity: 0; transform: translateY(32px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes auth-field-enter {
                    from { opacity: 0; transform: translateX(-16px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes auth-pulse-ring {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1); opacity: 0.3; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
                @keyframes auth-shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes strength-fill {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
                .auth-page {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(-45deg, #0f0c29, #1a1145, #24243e, #0f172a);
                    background-size: 400% 400%;
                    animation: auth-gradient 15s ease infinite;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                .auth-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.4;
                    pointer-events: none;
                }
                .auth-orb-1 {
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, hsl(160, 80%, 45%) 0%, transparent 70%);
                    top: -10%; right: -5%;
                    animation: auth-float-1 20s ease-in-out infinite;
                }
                .auth-orb-2 {
                    width: 350px; height: 350px;
                    background: radial-gradient(circle, hsl(245, 70%, 55%) 0%, transparent 70%);
                    bottom: -8%; left: -5%;
                    animation: auth-float-2 25s ease-in-out infinite;
                }
                .auth-orb-3 {
                    width: 250px; height: 250px;
                    background: radial-gradient(circle, hsl(200, 80%, 50%) 0%, transparent 70%);
                    top: 40%; left: 55%;
                    animation: auth-float-3 18s ease-in-out infinite;
                }
                .auth-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 440px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(40px) saturate(150%);
                    -webkit-backdrop-filter: blur(40px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow:
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        0 20px 60px -12px rgba(0, 0, 0, 0.4),
                        0 0 120px -40px hsla(160, 80%, 45%, 0.2);
                    animation: auth-card-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .auth-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.15) 0%,
                        rgba(255, 255, 255, 0.02) 50%,
                        rgba(255, 255, 255, 0.08) 100%
                    );
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }
                .auth-logo-ring {
                    width: 56px; height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, hsl(160, 70%, 42%), hsl(200, 70%, 50%));
                    position: relative;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 8px 32px -8px hsla(160, 70%, 42%, 0.5);
                }
                .auth-logo-ring::after {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border-radius: 20px;
                    border: 2px solid hsla(160, 70%, 42%, 0.3);
                    animation: auth-pulse-ring 3s ease-in-out infinite;
                }
                .auth-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #ffffff;
                    text-align: center;
                    margin-bottom: 0.375rem;
                    letter-spacing: -0.02em;
                }
                .auth-subtitle {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.5);
                    text-align: center;
                    margin-bottom: 2rem;
                    font-weight: 400;
                }
                .auth-field {
                    margin-bottom: 1.25rem;
                    opacity: 0;
                    animation: auth-field-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .auth-field:nth-child(1) { animation-delay: 0.1s; }
                .auth-field:nth-child(2) { animation-delay: 0.2s; }
                .auth-field:nth-child(3) { animation-delay: 0.3s; }
                .auth-label {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }
                .auth-input-wrap {
                    position: relative;
                }
                .auth-input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 18px;
                    pointer-events: none;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                }
                .auth-input {
                    width: 100%;
                    padding: 0.8125rem 0.875rem 0.8125rem 2.75rem;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1.5px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px;
                    color: #ffffff;
                    font-size: 0.9375rem;
                    font-weight: 400;
                    font-family: inherit;
                    outline: none;
                    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
                    letter-spacing: 0.01em;
                }
                .auth-input::placeholder {
                    color: rgba(255, 255, 255, 0.25);
                }
                .auth-input:hover {
                    border-color: rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.08);
                }
                .auth-input:focus {
                    border-color: hsl(160, 70%, 48%);
                    background: rgba(255, 255, 255, 0.08);
                    box-shadow:
                        0 0 0 3px hsla(160, 70%, 42%, 0.2),
                        0 2px 8px -2px hsla(160, 70%, 42%, 0.25);
                }
                .auth-input:focus ~ .auth-input-icon,
                .auth-input-wrap:focus-within .auth-input-icon {
                    color: hsl(160, 70%, 55%);
                }
                .auth-password-toggle {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.3);
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                    font-size: 18px;
                }
                .auth-password-toggle:hover {
                    color: rgba(255, 255, 255, 0.6);
                }
                .auth-strength-bar {
                    display: flex;
                    gap: 4px;
                    margin-top: 10px;
                    align-items: center;
                }
                .auth-strength-segment {
                    flex: 1;
                    height: 3px;
                    border-radius: 2px;
                    background: rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .auth-strength-segment-fill {
                    height: 100%;
                    border-radius: 2px;
                    transform-origin: left;
                    animation: strength-fill 0.4s ease forwards;
                }
                .auth-strength-label {
                    font-size: 0.6875rem;
                    font-weight: 500;
                    margin-left: 8px;
                    white-space: nowrap;
                    transition: color 0.3s;
                }
                .auth-submit {
                    width: 100%;
                    padding: 0.875rem;
                    border: none;
                    border-radius: 14px;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    font-family: inherit;
                    color: #ffffff;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, hsl(160, 70%, 38%), hsl(200, 70%, 45%));
                    box-shadow:
                        0 8px 24px -6px hsla(160, 70%, 38%, 0.45),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15);
                    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                    letter-spacing: 0.01em;
                }
                .auth-submit:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow:
                        0 12px 32px -6px hsla(160, 70%, 38%, 0.55),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }
                .auth-submit:active:not(:disabled) {
                    transform: translateY(0) scale(0.985);
                }
                .auth-submit:disabled {
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                .auth-submit-shimmer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.15) 50%,
                        transparent 100%
                    );
                    background-size: 200% 100%;
                    animation: auth-shimmer 1.5s ease-in-out infinite;
                }
                .auth-spinner {
                    width: 20px; height: 20px;
                    border: 2.5px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #ffffff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin: 1.75rem 0;
                }
                .auth-divider::before,
                .auth-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
                }
                .auth-divider span {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.35);
                    font-weight: 500;
                    white-space: nowrap;
                }
                .auth-features {
                    display: flex;
                    gap: 0.625rem;
                    margin-bottom: 0.25rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .auth-feature-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.375rem 0.75rem;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 20px;
                    font-size: 0.6875rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.45);
                }
                .auth-feature-chip svg {
                    color: hsl(160, 70%, 55%);
                }
                .auth-footer {
                    text-align: center;
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.45);
                    font-weight: 400;
                }
                .auth-footer a {
                    color: hsl(160, 80%, 60%);
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .auth-footer a:hover {
                    color: #ffffff;
                }
                .auth-brand-bottom {
                    position: absolute;
                    bottom: 1.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.2);
                    font-weight: 400;
                    z-index: 5;
                }
                @media (max-width: 480px) {
                    .auth-card {
                        padding: 2rem 1.5rem;
                        border-radius: 20px;
                    }
                    .auth-title { font-size: 1.5rem; }
                }
            `}</style>

            <div className="auth-page">
                {/* Floating gradient orbs */}
                <div className="auth-orb auth-orb-1" />
                <div className="auth-orb auth-orb-2" />
                <div className="auth-orb auth-orb-3" />

                {/* Subtle grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1, opacity: 0.03,
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                    pointerEvents: 'none',
                }} />

                <div className="auth-card" style={{ opacity: mounted ? 1 : 0 }}>
                    {/* Logo */}
                    <div className="auth-logo-ring">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                    </div>

                    <h1 className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Start managing your expenses with ExpenseFlow</p>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Full Name */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="register-name">
                                <span>Full Name</span>
                            </label>
                            <div className="auth-input-wrap">
                                <input
                                    id="register-name"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    minLength={2}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="auth-input"
                                    placeholder="John Doe"
                                />
                                <span className="auth-input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="register-email">
                                <span>Email Address</span>
                            </label>
                            <div className="auth-input-wrap">
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    placeholder="you@example.com"
                                />
                                <span className="auth-input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M22 7l-10 7L2 7" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="register-password">
                                <span>Password</span>
                            </label>
                            <div className="auth-input-wrap">
                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="auth-input"
                                    placeholder="Min 6 characters"
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <span className="auth-input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </span>
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Password strength meter */}
                            {strength && (
                                <div className="auth-strength-bar">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div key={level} className="auth-strength-segment">
                                            {level <= strength.score && (
                                                <div
                                                    className="auth-strength-segment-fill"
                                                    style={{ background: strength.color }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <span className="auth-strength-label" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button type="submit" className="auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="auth-spinner" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14" />
                                        <path d="M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                            {!isLoading && <span className="auth-submit-shimmer" />}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>what you get</span>
                    </div>

                    {/* Feature chips */}
                    <div className="auth-features">
                        <div className="auth-feature-chip">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Smart tracking
                        </div>
                        <div className="auth-feature-chip">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Analytics
                        </div>
                        <div className="auth-feature-chip">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            100% Free
                        </div>
                    </div>

                    <div style={{ marginTop: '1.25rem' }}>
                        <p className="auth-footer">
                            Already have an account?{' '}
                            <Link to="/login">Sign in instead</Link>
                        </p>
                    </div>
                </div>

                <div className="auth-brand-bottom">
                    © {new Date().getFullYear()} ExpenseFlow · Crafted with precision
                </div>
            </div>

            {error && (
                <Toast
                    message={error}
                    type="error"
                    isVisible={!!error}
                    onClose={() => setError(null)}
                />
            )}
        </>
    );
};
