import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import Toast from '../components/ui/Toast';
import { Landmark, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await authApi.login({ email, password });
            if (res.success && res.data) {
                login(res.data.token, {
                    id: res.data.id,
                    fullName: res.data.fullName,
                    email: res.data.email,
                });
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen flex items-center justify-center p-4">
            <main className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                {/* Header Section */}
                <header className="pt-8 pb-6 px-8 text-center border-b border-outline-variant/30">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-container text-on-primary-container mb-4">
                        <Landmark size={24} />
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-primary">Ledgerly</h1>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Calm Finance</p>
                </header>

                {/* Form Section */}
                <section className="p-8">
                    {/* Toggle Tabs (Login / Sign Up) */}
                    <div className="flex bg-surface-container-low rounded-lg p-1 mb-8" role="tablist">
                        <button
                            aria-selected="true"
                            className="flex-1 py-2 px-4 rounded-md font-body-sm text-body-sm font-medium bg-surface-container-lowest shadow-sm text-on-surface transition-all duration-200"
                            role="tab"
                            type="button"
                        >
                            Log In
                        </button>
                        <button
                            aria-selected="false"
                            className="flex-1 py-2 px-4 rounded-md font-body-sm text-body-sm font-medium text-on-surface-variant hover:text-on-surface transition-all duration-200"
                            role="tab"
                            type="button"
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">
                                    Password
                                </label>
                                <Link className="font-body-sm text-body-sm text-primary hover:text-primary-fixed-dim transition-colors" to="/forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full h-10 px-3 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
                                    onClick={() => setShowPassword(!showPassword)}
                                    type="button"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full h-10 mt-6 bg-primary text-on-primary font-title-md text-title-md !text-[15px] rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging In..." : "Log In"}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    {/* Divider */}
                    {/* <div className="relative my-6">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-outline-variant"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 bg-surface-container-lowest font-body-sm text-body-sm text-on-surface-variant">
                                Or continue with
                            </span>
                        </div>
                    </div> */}

                    {/* Social Auth */}
                    {/* <button
                        className="w-full h-10 flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg hover:bg-surface-container-low transition-colors"
                        type="button"
                    >
                        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                            <path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z" fill="#34A853" />
                        </svg>
                        Google
                    </button> */}
                </section>

                {/* Decorative Bottom Bar */}
                <div className="h-1 w-full bg-primary-container"></div>
            </main>

            {error && (
                <Toast
                    message={error}
                    type="error"
                    isVisible={!!error}
                    onClose={() => setError(null)}
                />
            )}
        </div>
    );
};
