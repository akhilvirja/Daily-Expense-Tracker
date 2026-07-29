import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Account } from '../../types';

interface AccountCardProps {
    account: Account;
    onEdit: (account: Account) => void;
    onDelete: (account: Account) => void;
}

const typeConfig: Record<string, { label: string; variant: 'primary' | 'success' | 'warning'; icon: string }> = {
    bank: { label: 'Bank', variant: 'primary', icon: '🏦' },
    cash: { label: 'Cash', variant: 'success', icon: '💵' },
    wallet: { label: 'Wallet', variant: 'warning', icon: '👛' },
};

/**
 * Formats a number as Indian Rupee currency
 */
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
    const config = typeConfig[account.type] || typeConfig.bank;
    const isPositive = account.currentBalance >= 0;

    return (
        <Card hoverable>
            {/* Card Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-lg)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-primary-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                        }}
                    >
                        {config.icon}
                    </div>
                    <div>
                        <h4
                            style={{
                                fontSize: 'var(--text-md)',
                                fontWeight: 600,
                                color: 'var(--color-text-heading)',
                                margin: 0,
                                lineHeight: 1.3,
                            }}
                        >
                            {account.name}
                        </h4>
                        {account.holderName && (
                            <span
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                {account.holderName}
                                {account.bankName ? ` • ${account.bankName}` : ''}
                            </span>
                        )}
                    </div>
                </div>
                <Badge variant={config.variant}>{config.label}</Badge>
            </div>

            {/* Balance */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <span
                    style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 500,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}
                >
                    Current Balance
                </span>
                <div
                    style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 700,
                        color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
                        lineHeight: 1.3,
                        marginTop: '2px',
                    }}
                >
                    {formatCurrency(account.currentBalance)}
                </div>
            </div>

            {/* Description */}
            {account.description && (
                <p
                    style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--spacing-lg)',
                        lineHeight: 1.5,
                    }}
                >
                    {account.description}
                </p>
            )}

            {/* Actions */}
            <div
                style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    paddingTop: 'var(--spacing-md)',
                    borderTop: '1px solid var(--color-border-light)',
                }}
            >
                <button
                    onClick={() => onEdit(account)}
                    style={{
                        flex: 1,
                        padding: '8px',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: 'var(--color-primary)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--color-primary-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-bg)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={() => onDelete(account)}
                    style={{
                        flex: 1,
                        padding: '8px',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: 'var(--color-danger)',
                        backgroundColor: 'transparent',
                        border: '1px solid hsla(0, 72%, 51%, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-danger-bg)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                >
                    🗑️ Delete
                </button>
            </div>
        </Card>
    );
};
