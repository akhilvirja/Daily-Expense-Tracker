import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import Toast from '../components/ui/Toast';
import { Landmark, ArrowRight, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
    
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setIsLoading(true);

        try {
            const res = await authApi.forgotPassword(email);
            if (res.success) {
                setSuccessMsg(res.message || 'Password reset link sent! Check your email.');
                setEmail('');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to request password reset.');
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
                    <h1 className="font-headline-lg text-headline-lg text-primary">Forgot Password</h1>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </header>

                {/* Form Section */}
                <section className="p-8">
                    {successMsg ? (
                        <div className="text-center animate-in fade-in duration-300">
                            <div className="bg-success-container/10 border border-success/20 text-success p-4 rounded-lg mb-6 font-body-sm text-body-sm">
                                {successMsg}
                            </div>
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 font-title-sm text-title-sm text-primary hover:text-primary-fixed-dim transition-colors"
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
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

                            {/* Submit Button */}
                            <button
                                className="w-full h-10 mt-6 bg-primary text-on-primary font-title-md text-title-md !text-[15px] rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    )}
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
