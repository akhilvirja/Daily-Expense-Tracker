import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { Toast } from '../components/ui/Toast';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            {/* Left side: Branding / Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 dark:bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 opacity-90 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                
                <div className="relative z-10 flex flex-col justify-between p-12 lg:p-20 text-white w-full h-full">
                    <div>
                        <div className="flex items-center gap-3 font-bold text-3xl tracking-tight">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-lg">
                                💸
                            </div>
                            ExpenseFlow
                        </div>
                    </div>
                    
                    <div className="space-y-6 max-w-xl">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                            Master your money, <br/>
                            <span className="text-indigo-200">shape your future.</span>
                        </h1>
                        <p className="text-lg text-indigo-100/90 font-medium leading-relaxed">
                            Take control of your daily finances with an intelligent, elegant tracker designed for professionals who demand more than just spreadsheets.
                        </p>
                    </div>
                    
                    <div className="text-indigo-200/60 text-sm font-medium">
                        © {new Date().getFullYear()} ExpenseFlow Inc.
                    </div>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
                {/* Mobile branding */}
                <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                        💸
                    </div>
                    ExpenseFlow
                </div>

                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Welcome back
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="peer w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm transition-all duration-200 
                                        focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none 
                                        group-hover:border-slate-300 dark:group-hover:border-slate-700
                                        invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500/10"
                                        placeholder="john@example.com"
                                    />
                                    <p className="hidden peer-[&:not(:placeholder-shown):not(:focus):invalid]:block mt-2 text-sm text-red-500 font-medium">
                                        Please enter a valid email address.
                                    </p>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm transition-all duration-200 
                                        focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none 
                                        group-hover:border-slate-300 dark:group-hover:border-slate-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Sign in to account'
                            )}
                        </button>

                        <div className="text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold transition-colors">
                                Create one now
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <Toast
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                />
            )}
        </div>
    );
};
