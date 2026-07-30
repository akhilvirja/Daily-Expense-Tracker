import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { AccountList } from '../components/accounts/AccountList';
import { AccountForm } from '../components/accounts/AccountForm';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { accountApi } from '../api/accountApi';
import type { Account, CreateAccountPayload, UpdateAccountPayload } from '../types';

export const AccountsPage: React.FC = () => {
    // State
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    // Toast State
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'info' as 'success' | 'error' | 'warning' | 'info',
    });

    const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setToast({ isVisible: true, message, type });
    };

    // Fetch Accounts
    const fetchAccounts = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await accountApi.getAll();
            if (response.success) {
                setAccounts(response.data);
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to fetch accounts', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    // Handlers
    const handleOpenCreateModal = () => {
        setSelectedAccount(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (account: Account) => {
        setSelectedAccount(account);
        setIsFormModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        setSelectedAccount(null);
    };

    const handleFormSubmit = async (payload: CreateAccountPayload | UpdateAccountPayload) => {
        try {
            setIsActionLoading(true);
            if (selectedAccount) {
                // Update
                const response = await accountApi.update(selectedAccount.id, payload as UpdateAccountPayload);
                if (response.success) {
                    showToast('Account updated successfully', 'success');
                    fetchAccounts();
                    handleCloseModal();
                }
            } else {
                // Create
                const response = await accountApi.create(payload as CreateAccountPayload);
                if (response.success) {
                    showToast('Account created successfully', 'success');
                    fetchAccounts();
                    handleCloseModal();
                }
            }
        } catch (error: any) {
            showToast(error.message || 'Action failed', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteAccount = async (account: Account) => {
        if (account.currentBalance !== 0) {
            showToast('Cannot delete account with a non-zero balance.', 'warning');
            return;
        }

        if (window.confirm(`Are you sure you want to delete "${account.name}"? This action cannot be undone.`)) {
            try {
                setIsActionLoading(true);
                const response = await accountApi.delete(account.id);
                if (response.success) {
                    showToast('Account deleted successfully', 'success');
                    fetchAccounts();
                }
            } catch (error: any) {
                showToast(error.message || 'Failed to delete account', 'error');
            } finally {
                setIsActionLoading(false);
            }
        }
    };

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

    return (
        <div>
            <Header
                title="Accounts & Ledger"
                subtitle="Manage your bank accounts, cash reserves, and digital wallets."
                actions={
                    <Button variant="primary" icon="➕" onClick={handleOpenCreateModal}>
                        New Account
                    </Button>
                }
            />

            {/* Total Balance Summary */}
            {!isLoading && accounts.length > 0 && (
                <div
                    style={{
                        marginBottom: 'var(--spacing-2xl)',
                        padding: 'var(--spacing-lg) var(--spacing-xl)',
                        backgroundColor: 'var(--color-primary-bg)',
                        border: '1px solid var(--color-primary-border)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-text)',
                                fontWeight: 500,
                            }}
                        >
                            Total Net Worth (Across all accounts)
                        </span>
                        <div
                            style={{
                                fontSize: 'var(--text-3xl)',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                lineHeight: 1.2,
                                marginTop: '4px',
                            }}
                        >
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                            }).format(totalBalance)}
                        </div>
                    </div>
                </div>
            )}

            <AccountList
                accounts={accounts}
                isLoading={isLoading}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteAccount}
            />

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={handleCloseModal}
                title={selectedAccount ? 'Edit Account' : 'Create New Account'}
                size="md"
            >
                <AccountForm
                    account={selectedAccount}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isLoading={isActionLoading}
                />
            </Modal>

            {/* Toast Notifications */}
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};
