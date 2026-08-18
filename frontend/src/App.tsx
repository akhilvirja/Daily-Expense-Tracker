import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AccountsPage } from './pages/AccountsPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import TrackerPage from './pages/TrackerPage';
import  BillingPage from './pages/BillingPage';
import { ReportsPage } from './pages/ReportsPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        {/* Wrap routes in MainLayout for sidebar */}
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            
                            {/* Phase 1: Accounts */}
                            <Route path="accounts" element={<AccountsPage />} />
                            
                            {/* Phase 2: Transactions */}
                            <Route path="transactions" element={<TransactionsPage />} />
                            
                            {/* Phase 2.5: Categories */}
                            <Route path="categories" element={<CategoriesPage />} />
                            
                            {/* Phase 3: Daily Tracker */}
                            <Route path="trackers" element={<TrackerPage />} />
                            
                            {/* Phase 4: Billing Module */}
                            <Route path="billing" element={<BillingPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            
                            {/* Placeholder routes for future modules */}
                            <Route path="settings" element={<div style={{ padding: '2rem' }}>Settings (Coming Soon)</div>} />
                        </Route>
                    </Route>
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
