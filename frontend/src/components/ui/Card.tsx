import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const paddingMap = {
    none: '0',
    sm: 'var(--spacing-md)',
    md: 'var(--spacing-xl)',
    lg: 'var(--spacing-2xl)',
};

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    style,
    hoverable = false,
    padding = 'md',
    onClick,
}) => {
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-xs)',
                padding: paddingMap[padding],
                transition: 'all var(--transition-base)',
                cursor: hoverable || onClick ? 'pointer' : 'default',
                animation: 'fadeInUp 0.3s ease-out',
                ...style,
            }}
            onMouseEnter={(e) => {
                if (hoverable || onClick) {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary-border)';
                }
            }}
            onMouseLeave={(e) => {
                if (hoverable || onClick) {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xs)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)';
                }
            }}
        >
            {children}
        </div>
    );
};
