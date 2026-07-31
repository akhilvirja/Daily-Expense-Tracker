import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * MainLayout — Combines the fixed Sidebar + Mobile Header + scrollable content area.
 * Layout: Sidebar pinned left | Main content taking the rest.
 * Fully responsive: sidebar becomes a drawer on mobile (<768px).
 */
export const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Close sidebar on window resize if going to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    return (
        <div className="flex bg-background min-h-screen text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Fixed Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main Content Column */}
            <main className="flex-1 w-full md:ml-64 flex flex-col min-h-screen">
                {/* Mobile Top Nav Bar (hidden on md) */}
                <Header onToggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
