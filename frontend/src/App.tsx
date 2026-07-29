import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AccountsPage } from './pages/AccountsPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Wrap routes in MainLayout for sidebar */}
                <Route path="/" element={<MainLayout />}>
                    {/* Redirect root to Dashboard (to be built in later phase, for now redirect to Accounts) */}
                    <Route index element={<Navigate to="/accounts" replace />} />
                    
                    {/* Phase 1: Accounts */}
                    <Route path="accounts" element={<AccountsPage />} />
                    
                    {/* Placeholder routes for future modules */}
                    <Route path="transactions" element={<div style={{ padding: '2rem' }}>Transactions Module (Phase 2)</div>} />
                    <Route path="daily-tracker" element={<div style={{ padding: '2rem' }}>Daily Tracker Module (Phase 3)</div>} />
                    <Route path="billing" element={<div style={{ padding: '2rem' }}>Billing Module (Phase 4)</div>} />
                    <Route path="reports" element={<div style={{ padding: '2rem' }}>Reports Module (Phase 5)</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
