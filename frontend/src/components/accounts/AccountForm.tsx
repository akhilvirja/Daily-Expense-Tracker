import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Account, CreateAccountPayload, UpdateAccountPayload } from '../../types';

interface AccountFormProps {
    account?: Account | null;
    onSubmit: (data: CreateAccountPayload | UpdateAccountPayload) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const accountTypeOptions = [
    { value: 'bank', label: '🏦 Bank Account' },
    { value: 'cash', label: '💵 Cash Reserve' },
    { value: 'wallet', label: '👛 Digital Wallet' },
];

export const AccountForm: React.FC<AccountFormProps> = ({
    account,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const isEditMode = !!account;

    const [formData, setFormData] = useState({
        name: '',
        type: 'bank',
        bankName: '',
        holderName: '',
        initialBalance: 0,
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Populate form when editing
    useEffect(() => {
        if (account) {
            setFormData({
                name: account.name,
                type: account.type,
                bankName: account.bankName || '',
                holderName: account.holderName || '',
                initialBalance: account.initialBalance,
                description: account.description || '',
            });
        }
    }, [account]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'initialBalance' ? parseFloat(value) || 0 : value,
        }));
        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Account name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Account name must be at least 2 characters';
        }
        if (!formData.type) {
            newErrors.type = 'Account type is required';
        }
        if (formData.initialBalance < 0) {
            newErrors.initialBalance = 'Initial balance cannot be negative';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: CreateAccountPayload = {
            name: formData.name.trim(),
            type: formData.type as 'bank' | 'cash' | 'wallet',
            bankName: formData.bankName.trim() || null,
            holderName: formData.holderName.trim() || null,
            initialBalance: formData.initialBalance,
            description: formData.description.trim() || null,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-lg)',
                }}
            >
                <Input
                    label="Account Name *"
                    name="name"
                    placeholder='e.g., "Paresh - HDFC" or "Cash - Home"'
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                />

                <Select
                    label="Account Type *"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={accountTypeOptions}
                    error={errors.type}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                    <Input
                        label="Bank Name"
                        name="bankName"
                        placeholder="e.g., HDFC, ICICI"
                        value={formData.bankName}
                        onChange={handleChange}
                    />
                    <Input
                        label="Account Holder"
                        name="holderName"
                        placeholder="e.g., Paresh, Harsha"
                        value={formData.holderName}
                        onChange={handleChange}
                    />
                </div>

                <Input
                    label="Initial Balance (₹)"
                    name="initialBalance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.initialBalance.toString()}
                    onChange={handleChange}
                    error={errors.initialBalance}
                    helperText={isEditMode ? 'Changing this will adjust the current balance accordingly' : undefined}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label
                        htmlFor="description"
                        style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                        }}
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Optional notes about this account..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: 'var(--text-base)',
                            fontFamily: 'var(--font-sans)',
                            color: 'var(--color-text-heading)',
                            backgroundColor: 'var(--color-bg-input)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            outline: 'none',
                            resize: 'vertical',
                            transition: 'border-color var(--transition-fast)',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>

                {/* Actions */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--spacing-sm)',
                        paddingTop: 'var(--spacing-md)',
                        borderTop: '1px solid var(--color-border-light)',
                    }}
                >
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        {isEditMode ? 'Update Account' : 'Create Account'}
                    </Button>
                </div>
            </div>
        </form>
    );
};
