import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

interface HeaderProps {
    onToggleSidebar: () => void;
}

/**
 * Header (Mobile Only) — Sticky top navigation bar matching the HTML reference.
 * Contains: Hamburger menu | Ledgerly logo | Search icon | User profile avatar
 * Hidden on desktop (md:hidden).
 */
export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    const { user } = useAuth();

    const initials = user?.fullName
        ? user.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'U';

    return (
        <header className="flex justify-between items-center w-full px-4 h-16 sticky top-0 z-30 bg-surface border-b border-outline-variant md:hidden">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onToggleSidebar}
                    className="flex items-center justify-center p-1 hover:bg-surface-container rounded-full transition-colors"
                    aria-label="Open sidebar menu"
                >
                    <Menu className="text-primary" size={24} />
                </button>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">
                    Ledgerly
                </h1>
            </div>
            
            <div className="flex items-center gap-4">
                
                {/* User Avatar */}
                <div
                    className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-title-sm font-bold text-sm cursor-pointer shadow-sm border border-outline-variant/30"
                    title={user?.fullName || 'User'}
                >
                    {initials}
                </div>
            </div>
        </header>
    );
};
