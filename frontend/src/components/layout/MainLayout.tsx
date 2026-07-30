import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * MainLayout — Combines the fixed Sidebar + TopNavBar (Header) + scrollable content area.
 * Layout: Sidebar pinned left | Right column: TopNavBar on top, content below
 * Fully responsive: sidebar becomes a drawer on mobile (<768px)
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
        <div className="main-layout">
            {/* Mobile overlay */}
            <div
                className={`sidebar-overlay${isSidebarOpen ? ' visible' : ''}`}
                onClick={closeSidebar}
            />

            {/* Fixed Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main Content Column (offset by sidebar width on desktop via CSS) */}
            <div className="main-content">
                {/* Sticky Top Nav Bar */}
                <Header onToggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
