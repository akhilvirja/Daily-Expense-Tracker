import React from 'react';
import { AccountCard } from './AccountCard';
import type { Account } from '../../types';

interface AccountListProps {
    accounts: Account[];
    onEdit: (account: Account) => void;
    onDelete: (account: Account) => void;
    isLoading?: boolean;
}

export const AccountList: React.FC<AccountListProps> = ({
    accounts,
    onEdit,
    onDelete,
    isLoading = false,
}) => {
    // Loading skeleton
    if (isLoading) {
        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 'var(--spacing-xl)',
                }}
            >
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            height: '220px',
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border-light)',
                            background:
                                'linear-gradient(90deg, var(--color-bg-hover) 25%, var(--color-bg-card) 50%, var(--color-bg-hover) 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                        }}
                    />
                ))}
            </div>
        );
    }

    // Empty state
    if (accounts.length === 0) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-3xl)',
                    color: 'var(--color-text-muted)',
                }}
            >
                <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-lg)' }}>🏦</div>
                <h3
                    style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 600,
                        color: 'var(--color-text-heading)',
                        marginBottom: 'var(--spacing-sm)',
                    }}
                >
                    No accounts yet
                </h3>
                <p style={{ fontSize: 'var(--text-base)' }}>
                    Create your first bank account or cash reserve to start tracking your finances.
                </p>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--spacing-xl)',
            }}
        >
            {accounts.map((account, index) => (
                <div
                    key={account.id}
                    style={{
                        animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                    }}
                >
                    <AccountCard account={account} onEdit={onEdit} onDelete={onDelete} />
                </div>
            ))}
        </div>
    );
};
