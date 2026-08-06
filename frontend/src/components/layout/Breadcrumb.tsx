import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    path?: string; // If no path, it's the current page (not clickable)
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

/**
 * Breadcrumb navigation component matching the reference layout.
 * e.g., "Dashboard > Ledger"
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav
            aria-label="Breadcrumb"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '16px',
            }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={item.label}>
                        {index > 0 && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                <ChevronRightIcon />
                            </span>
                        )}
                        {item.path && !isLast ? (
                            <Link
                                to={item.path}
                                style={{
                                    fontSize: 'var(--text-base)',
                                    color: 'var(--color-text-secondary)',
                                    textDecoration: 'none',
                                    fontWeight: 400,
                                    transition: 'color 150ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--color-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                                }}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                style={{
                                    fontSize: 'var(--text-base)',
                                    color: isLast ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    fontWeight: isLast ? 600 : 400,
                                }}
                            >
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
