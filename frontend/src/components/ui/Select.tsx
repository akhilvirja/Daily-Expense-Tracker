import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    placeholder = 'Select an option',
    id,
    style,
    ...props
}) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && (
                <label
                    htmlFor={selectId}
                    style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: 'var(--color-text)',
                    }}
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
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
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%23666'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
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
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>
                    {error}
                </span>
            )}
        </div>
    );
};
