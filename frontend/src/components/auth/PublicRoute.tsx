import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PublicRoute = () => {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (token) {
        // If user is already logged in, redirect to the dashboard (or accounts)
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
