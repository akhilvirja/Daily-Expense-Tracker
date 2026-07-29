import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
        background-color: var(--color-primary);
        color: var(--color-text-on-primary);
        border: 1px solid transparent;
    `,
    secondary: `
        background-color: transparent;
        color: var(--color-primary);
        border: 1px solid var(--color-primary-border);
    `,
    danger: `
        background-color: var(--color-danger);
        color: white;
        border: 1px solid transparent;
    `,
    ghost: `
        background-color: transparent;
        color: var(--color-text);
        border: 1px solid var(--color-border);
    `,
    success: `
        background-color: var(--color-success);
        color: white;
        border: 1px solid transparent;
    `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: `
        padding: var(--spacing-xs) var(--spacing-md);
        font-size: var(--text-sm);
        border-radius: var(--radius-sm);
        gap: 6px;
    `,
    md: `
        padding: var(--spacing-sm) var(--spacing-lg);
        font-size: var(--text-base);
        border-radius: var(--radius-md);
        gap: 8px;
    `,
    lg: `
        padding: var(--spacing-md) var(--spacing-xl);
        font-size: var(--text-md);
        border-radius: var(--radius-md);
        gap: 10px;
    `,
};

const baseStyle = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-family: var(--font-sans);
    cursor: pointer;
    transition: all var(--transition-fast);
    outline: none;
    white-space: nowrap;
    user-select: none;
`;

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    fullWidth = false,
    children,
    disabled,
    style,
    ...props
}) => {
    const cssText = [
        baseStyle,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'width: 100%;' : '',
        disabled || isLoading ? 'opacity: 0.6; cursor: not-allowed;' : '',
    ].join('');

    // Convert CSS text to style object
    const inlineStyle: React.CSSProperties = {};
    cssText.split(';').forEach((rule) => {
        const [prop, val] = rule.split(':').map((s) => s.trim());
        if (prop && val) {
            const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            (inlineStyle as Record<string, string>)[camelProp] = val;
        }
    });

    return (
        <button
            style={{ ...inlineStyle, ...style }}
            disabled={disabled || isLoading}
            onMouseEnter={(e) => {
                if (!disabled && !isLoading) {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                }
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            {...props}
        >
            {isLoading ? (
                <span
                    style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid currentColor',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                    }}
                />
            ) : icon ? (
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
            ) : null}
            {children}
        </button>
    );
};
