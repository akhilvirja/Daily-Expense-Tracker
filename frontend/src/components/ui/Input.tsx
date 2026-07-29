import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    id,
    style,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && (
                <label
                    htmlFor={inputId}
                    style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: 'var(--color-text)',
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-text-heading)',
                    backgroundColor: 'var(--color-bg-input)',
                    border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    transition: 'all var(--transition-fast)',
                    boxSizing: 'border-box',
                    ...style,
                }}
                onFocus={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = error
                        ? 'var(--color-danger)'
                        : 'var(--color-primary)';
                    (e.currentTarget as HTMLElement).style.boxShadow = error
                        ? '0 0 0 3px var(--color-danger-bg)'
                        : '0 0 0 3px var(--color-primary-bg)';
                }}
                onBlur={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = error
                        ? 'var(--color-danger)'
                        : 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
                {...props}
            />
            {error && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>
                    {error}
                </span>
            )}
            {helperText && !error && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {helperText}
                </span>
            )}
        </div>
    );
};
