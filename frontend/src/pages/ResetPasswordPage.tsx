import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import Toast from '../components/ui/Toast';
import { Landmark, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        
        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await authApi.resetPassword(token, password);
            if (res.success) {
                setSuccessMsg('Your password has been successfully reset! You can now log in.');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The token may be expired.');
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
                    <h1 className="font-headline-lg text-headline-lg text-primary">Reset Password</h1>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                        Enter a new password for your account.
                    </p>
                </header>

                {/* Form Section */}
                <section className="p-8">
                    {successMsg ? (
                        <div className="text-center animate-in fade-in duration-300">
                            <div className="bg-success-container/10 border border-success/20 text-success p-4 rounded-lg mb-6 font-body-sm text-body-sm">
                                {successMsg}
                            </div>
                            <p className="text-sm text-on-surface-variant">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
                            {/* New Password Field */}
                            <div>
                                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="password">
                                    New Password
                                </label>
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

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full h-10 px-3 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full h-10 mt-6 bg-primary text-on-primary font-title-md text-title-md !text-[15px] rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
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
