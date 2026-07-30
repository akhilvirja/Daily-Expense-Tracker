import React from 'react';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
}

/**
 * PageHeader — Replaces the old Header component for page-level titles.
 * Displays breadcrumb, large title, subtitle, and optional action buttons.
 * Matches the reference image layout.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs, actions }) => {
    return (
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
            {/* Breadcrumb */}
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}

            {/* Title + Actions Row */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h1
                        style={{
                            fontWeight: 700,
                            color: 'var(--color-text-heading)',
                            margin: 0,
                            lineHeight: 1.3,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {title}
                    </h1>
                    {subtitle && (
                        <p
                            style={{
                                fontSize: 'var(--text-base)',
                                color: 'var(--color-text-secondary)',
                                marginTop: '4px',
                                fontWeight: 400,
                            }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexShrink: 0 }}>
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};
