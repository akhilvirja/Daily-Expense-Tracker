import React from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 'var(--spacing-xl)',
                borderBottom: '1px solid var(--color-border-light)',
                marginBottom: 'var(--spacing-xl)',
            }}
        >
            <div>
                <h1
                    style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 700,
                        color: 'var(--color-text-heading)',
                        margin: 0,
                        lineHeight: 1.3,
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
                        }}
                    >
                        {subtitle}
                    </p>
                )}
            </div>
            {actions && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    {actions}
                </div>
            )}
        </div>
    );
};
