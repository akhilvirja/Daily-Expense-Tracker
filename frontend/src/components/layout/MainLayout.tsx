import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main
                style={{
                    flex: 1,
                    marginLeft: 'var(--sidebar-width)',
                    padding: 'var(--spacing-2xl)',
                    backgroundColor: 'var(--color-bg)',
                    minHeight: '100vh',
                    animation: 'fadeIn 0.3s ease-out',
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};
