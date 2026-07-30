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

const accountKindOptions = [
    { value: 'bank', label: '🏦 Bank Account' },
    { value: 'cash', label: '💵 Cash Reserve' },
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
        kind: 'bank',
        openingBalance: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Populate form when editing
    useEffect(() => {
        if (account) {
            setFormData({
                name: account.name,
                kind: account.kind,
                openingBalance: account.openingBalance,
            });
        }
    }, [account]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'openingBalance' ? parseFloat(value) || 0 : value,
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
        if (!formData.kind) {
            newErrors.kind = 'Account kind is required';
        }
        if (formData.openingBalance < 0) {
            newErrors.openingBalance = 'Opening balance cannot be negative';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: CreateAccountPayload | UpdateAccountPayload = {
            // Temporary default user ID until authentication is available
            ...(isEditMode ? {} : { userId: '123e4567-e89b-12d3-a456-426614174000' }), 
            name: formData.name.trim(),
            kind: formData.kind as 'bank' | 'cash',
            openingBalance: formData.openingBalance,
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
                    label="Account Kind *"
                    name="kind"
                    value={formData.kind}
                    onChange={handleChange}
                    options={accountKindOptions}
                    error={errors.kind}
                />

                <Input
                    label="Opening Balance (₹)"
                    name="openingBalance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.openingBalance.toString()}
                    onChange={handleChange}
                    error={errors.openingBalance}
                    helperText={isEditMode ? 'Changing this will adjust the current balance accordingly' : undefined}
                />

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
