import React, { useState, useEffect, useCallback } from 'react';
import { AccountList } from '../components/accounts/AccountList';
import { AccountForm } from '../components/accounts/AccountForm';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { accountApi } from '../api/accountApi';
import type { Account, CreateAccountPayload, UpdateAccountPayload } from '../types';

export const AccountsPage: React.FC = () => {
    // State
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
                const response = await accountApi.create({ ...payload, isActive: true } as CreateAccountPayload);
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

    const handleToggleStatus = async (account: Account) => {
        try {
            const updatedIsActive = !account.isActive;
            // Optimistic update
            setAccounts(prev => prev.map(acc => acc.id === account.id ? { ...acc, isActive: updatedIsActive } : acc));
            
            const response = await accountApi.update(account.id, { isActive: updatedIsActive });
            if (response.success) {
                showToast(`Account ${updatedIsActive ? 'activated' : 'deactivated'} successfully`, 'success');
            } else {
                // Revert on failure
                fetchAccounts();
                showToast('Failed to update account status', 'error');
            }
        } catch (error: any) {
            fetchAccounts(); // Revert on failure
            showToast(error.message || 'Failed to update account status', 'error');
        }
    };

    // Filter accounts by search query
    const filteredAccounts = accounts.filter(acc => 
        acc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1200px] mx-auto p-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-slate-500 mb-6">
                <span>Dashboard</span>
                <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-semibold text-slate-900">Ledger</span>
            </div>

            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Ledger Management</h1>
                    <p className="text-slate-500">Manage all bank and cash accounts in one place.</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 bg-[#5B5CEF] hover:bg-[#4b4ce6] text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                    </svg>
                    Add Ledger
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative w-full max-w-[320px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl focus:outline-none focus:border-[#5B5CEF] focus:ring-1 focus:ring-[#5B5CEF] transition-colors text-sm text-slate-700 shadow-sm placeholder-slate-400"
                        placeholder="Search accounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Account List */}
            <AccountList
                accounts={filteredAccounts}
                isLoading={isLoading}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteAccount}
                onToggleStatus={handleToggleStatus}
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
