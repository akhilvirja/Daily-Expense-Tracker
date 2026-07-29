import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    style?: React.CSSProperties;
}

const variantColors: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
    default: {
        bg: 'var(--color-bg-hover)',
        color: 'var(--color-text)',
        border: 'var(--color-border)',
    },
    primary: {
        bg: 'var(--color-primary-bg)',
        color: 'var(--color-primary)',
        border: 'var(--color-primary-border)',
    },
    success: {
        bg: 'var(--color-success-bg)',
        color: 'var(--color-success)',
        border: 'hsla(152, 69%, 40%, 0.25)',
    },
    warning: {
        bg: 'var(--color-warning-bg)',
        color: 'hsl(38, 92%, 40%)',
        border: 'hsla(38, 92%, 50%, 0.25)',
    },
    danger: {
        bg: 'var(--color-danger-bg)',
        color: 'var(--color-danger)',
        border: 'hsla(0, 72%, 51%, 0.25)',
    },
    info: {
        bg: 'var(--color-info-bg)',
        color: 'var(--color-info)',
        border: 'hsla(210, 92%, 56%, 0.25)',
    },
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', style }) => {
    const colors = variantColors[variant];

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 10px',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                borderRadius: 'var(--radius-full)',
                backgroundColor: colors.bg,
                color: colors.color,
                border: `1px solid ${colors.border}`,
                lineHeight: '1.6',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                ...style,
            }}
        >
            {children}
        </span>
    );
};
