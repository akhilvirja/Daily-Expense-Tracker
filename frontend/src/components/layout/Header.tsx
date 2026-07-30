import React from 'react';
import { useAuth } from '../../context/AuthContext';

/* ─── Icon Components ─── */
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

interface HeaderProps {
    onToggleSidebar: () => void;
}

/**
 * TopNavBar — Sticky top navigation bar matching the reference image.
 * Contains: Hamburger (mobile) | Global search | Dark mode toggle | Notifications | User profile
 */
export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();

    const initials = user?.fullName
        ? user.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'U';

    return (
        <header className="topnav">
            {/* ── Hamburger (mobile only — hidden on desktop via CSS) ── */}
            <button
                className="hamburger-btn"
                onClick={onToggleSidebar}
                aria-label="Open sidebar menu"
            >
                <MenuIcon />
            </button>

            {/* ── Search Bar ── */}
            <div className="topnav-search">
                <span
                    style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Search transactions, ledgers, bills..."
                    style={{
                        width: '100%',
                        padding: '9px 16px 9px 42px',
                        backgroundColor: 'var(--topnav-search-bg)',
                        border: '1px solid var(--topnav-search-border)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-base)',
                        color: 'var(--color-text)',
                        outline: 'none',
                        transition: 'all 200ms ease',
                        fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-primary-border)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px hsla(245, 58%, 51%, 0.08)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--topnav-search-border)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                />
            </div>

            {/* ── Right Section ── */}
            <div className="topnav-right">
                {/* Dark Mode Toggle */}
                <button
                    style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 180ms ease',
                    }}
                    title="Toggle dark mode"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                        e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                >
                    <MoonIcon />
                </button>

                {/* Notifications */}
                <button
                    style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 180ms ease',
                        position: 'relative',
                    }}
                    title="Notifications"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                        e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                >
                    <BellIcon />
                </button>

                {/* ── User Profile ── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginLeft: '8px',
                        padding: '6px 12px 6px 6px',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        transition: 'background-color 180ms ease',
                    }}
                    onClick={() => {
                        if (window.confirm('Do you want to sign out?')) {
                            logout();
                            window.location.href = '/login';
                        }
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    {/* Avatar Circle */}
                    <div
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '13px',
                            letterSpacing: '0.02em',
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </div>
                    <span className="topnav-username">
                        {user?.fullName || 'User'}
                    </span>
                    <ChevronDownIcon />
                </div>
            </div>
        </header>
    );
};
