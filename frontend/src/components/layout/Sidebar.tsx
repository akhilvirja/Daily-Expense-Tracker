import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/* ─── SVG Icon Components ─── */
const DashboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const LedgerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const TransactionsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
);

const DailyItemsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const BillsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const ReportsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/* ─── Navigation Configuration ─── */
interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/accounts', label: 'Ledger', icon: <LedgerIcon /> },
    { path: '/transactions', label: 'Transactions', icon: <TransactionsIcon /> },
    { path: '/daily-tracker', label: 'Daily Items', icon: <DailyItemsIcon /> },
    { path: '/billing', label: 'Bills', icon: <BillsIcon /> },
    { path: '/reports', label: 'Reports', icon: <ReportsIcon /> },
];

const settingsItem: NavItem = { path: '/settings', label: 'Settings', icon: <SettingsIcon /> };

/* ─── Sidebar Component ─── */
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();

    const isItemActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const renderNavLink = (item: NavItem) => {
        const active = isItemActive(item.path);

        return (
            <li key={item.path}>
                <NavLink
                    to={item.path}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontSize: 'var(--text-base)',
                        fontWeight: active ? 600 : 450,
                        color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                        backgroundColor: active ? 'var(--sidebar-active-bg)' : 'transparent',
                        textDecoration: 'none',
                        transition: 'all 180ms ease',
                        position: 'relative',
                        borderLeft: active ? '3px solid var(--sidebar-active-border)' : '3px solid transparent',
                        marginLeft: active ? '0' : '0',
                    }}
                    onMouseEnter={(e) => {
                        if (!active) {
                            e.currentTarget.style.backgroundColor = 'var(--sidebar-active-bg)';
                            e.currentTarget.style.color = 'var(--sidebar-text-hover)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!active) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--sidebar-text)';
                        }
                    }}
                >
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: active ? 'var(--sidebar-icon-active)' : 'var(--sidebar-icon)',
                        transition: 'color 180ms ease',
                    }}>
                        {item.icon}
                    </span>
                    <span>{item.label}</span>
                </NavLink>
            </li>
        );
    };

    return (
        <aside className={`sidebar${isOpen ? ' open' : ''}`}>
            {/* ── Logo / Brand + Close button (mobile) ── */}
            <div
                style={{
                    padding: '20px 20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <h2
                            style={{
                                fontSize: '1.15rem',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                margin: 0,
                                lineHeight: 1.2,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Ledgrly
                        </h2>
                        <span
                            style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--sidebar-label)',
                                letterSpacing: '0.01em',
                                fontWeight: 400,
                            }}
                        >
                            Expense & Daily Tracker
                        </span>
                    </div>
                </div>

                {/* Close button — visible only on mobile via CSS */}
                <button
                    onClick={onClose}
                    className="sidebar-close-btn"
                    style={{
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 180ms ease',
                        flexShrink: 0,
                    }}
                    aria-label="Close sidebar"
                >
                    <CloseIcon />
                </button>
            </div>

            {/* ── MENU Label ── */}
            <div
                style={{
                    padding: '16px 20px 8px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--sidebar-label)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                }}
            >
                MENU
            </div>

            {/* ── Navigation ── */}
            <nav style={{ flex: 1, padding: '0 12px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {navItems.map(renderNavLink)}
                </ul>

                {/* Settings - separated */}
                <div style={{ marginTop: '8px', paddingTop: '8px' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {renderNavLink(settingsItem)}
                    </ul>
                </div>
            </nav>

            {/* ── Bottom Brand Card ── */}
            <div style={{ padding: '16px 16px 20px', marginTop: 'auto' }}>
                <div
                    style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, hsla(245, 58%, 51%, 0.06), hsla(245, 58%, 51%, 0.02))',
                        border: '1px solid hsla(245, 58%, 51%, 0.1)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            marginBottom: '4px',
                        }}
                    >
                        FinTrack Pro
                    </div>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--sidebar-label)',
                            lineHeight: 1.5,
                        }}
                    >
                        Your private expense & daily tracker.
                    </div>
                </div>
            </div>
        </aside>
    );
};
