import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
    path: string;
    label: string;
    icon: string;
}

const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/accounts', label: 'Accounts', icon: '🏦' },
    { path: '/transactions', label: 'Transactions', icon: '💸' },
    { path: '/daily-tracker', label: 'Daily Tracker', icon: '📋' },
    { path: '/billing', label: 'Billing', icon: '🧾' },
    { path: '/reports', label: 'Reports', icon: '📈' },
];

export const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside
            style={{
                width: 'var(--sidebar-width)',
                minHeight: '100vh',
                backgroundColor: 'var(--color-bg-sidebar)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 'var(--z-sticky)' as unknown as number,
                borderRight: '1px solid hsla(230, 25%, 25%, 0.3)',
            }}
        >
            {/* Logo / Brand */}
            <div
                style={{
                    padding: 'var(--spacing-xl)',
                    borderBottom: '1px solid hsla(230, 25%, 25%, 0.3)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                        }}
                    >
                        💰
                    </div>
                    <div>
                        <h2
                            style={{
                                fontSize: 'var(--text-md)',
                                fontWeight: 700,
                                color: 'white',
                                margin: 0,
                                lineHeight: 1.2,
                            }}
                        >
                            ExpenseTracker
                        </h2>
                        <span
                            style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--color-text-sidebar)',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Daily Finance Manager
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: 'var(--spacing-lg) var(--spacing-sm)' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 16px',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: 'var(--text-base)',
                                        fontWeight: isActive ? 500 : 400,
                                        color: isActive
                                            ? 'var(--color-text-sidebar-active)'
                                            : 'var(--color-text-sidebar)',
                                        backgroundColor: isActive
                                            ? 'hsla(245, 58%, 51%, 0.2)'
                                            : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'all var(--transition-fast)',
                                        position: 'relative',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLElement).style.backgroundColor =
                                                'hsla(245, 58%, 51%, 0.1)';
                                            (e.currentTarget as HTMLElement).style.color =
                                                'var(--color-text-sidebar-active)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                            (e.currentTarget as HTMLElement).style.color =
                                                'var(--color-text-sidebar)';
                                        }
                                    }}
                                >
                                    {isActive && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '3px',
                                                height: '60%',
                                                backgroundColor: 'var(--color-primary-light)',
                                                borderRadius: '0 3px 3px 0',
                                            }}
                                        />
                                    )}
                                    <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div
                style={{
                    padding: 'var(--spacing-lg) var(--spacing-xl)',
                    borderTop: '1px solid hsla(230, 25%, 25%, 0.3)',
                }}
            >
                <span
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-sidebar)',
                        opacity: 0.6,
                    }}
                >
                    v1.0.0 • Built with AI
                </span>
            </div>
        </aside>
    );
};
