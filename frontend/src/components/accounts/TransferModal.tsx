import React, { useState, useEffect } from 'react';
import type { Account } from '../../types';
import type { TransferPayload } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { ArrowRightLeft } from 'lucide-react';

interface TransferModalProps {
  accounts: Account[];
  onSubmit: (payload: TransferPayload) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  accounts,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const activeAccounts = accounts.filter(a => a.isActive);

  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-select first account if available
  useEffect(() => {
    if (activeAccounts.length > 0 && !fromAccountId) {
      setFromAccountId(activeAccounts[0].id);
    }
  }, [activeAccounts, fromAccountId]);

  // Ensure toAccountId is valid
  useEffect(() => {
    if (fromAccountId === toAccountId) {
      setToAccountId('');
    }
  }, [fromAccountId, toAccountId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fromAccountId) newErrors.fromAccountId = 'Source account is required';
    if (!toAccountId) newErrors.toAccountId = 'Destination account is required';
    if (fromAccountId === toAccountId) newErrors.toAccountId = 'Cannot transfer to the same account';
    
    const amountNum = Number(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Valid amount is required';
    } else {
      const sourceAccount = activeAccounts.find(a => a.id === fromAccountId);
      if (sourceAccount && sourceAccount.currentBalance < amountNum) {
         newErrors.amount = 'Insufficient balance in source account';
      }
    }
    
    if (!occurredOn) newErrors.occurredOn = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      fromAccountId,
      toAccountId,
      amount: Number(amount),
      description: description.trim() || undefined,
      occurredOn: new Date(occurredOn).toISOString(),
    });
  };

  const accountOptions = activeAccounts.map(a => ({
    value: a.id,
    label: `${a.name} (₹${a.currentBalance})`
  }));

  const destinationOptions = activeAccounts
    .filter(a => a.id !== fromAccountId)
    .map(a => ({
      value: a.id,
      label: `${a.name} (₹${a.currentBalance})`
    }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-3 mb-2 p-3 bg-primary-container/20 rounded-lg text-on-surface">
        <ArrowRightLeft className="text-primary" size={24} />
        <div>
           <p className="font-title-sm font-semibold">Self Transfer</p>
           <p className="text-xs text-on-surface-variant">Move funds between your own accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Select
          label="From Account"
          options={accountOptions}
          value={fromAccountId}
          onChange={(e) => setFromAccountId(e.target.value)}
          error={errors.fromAccountId}
          required
        />

        <Select
          label="To Account"
          options={destinationOptions}
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
          error={errors.toAccountId}
          disabled={!fromAccountId}
          required
        />
        
        <Input
          label="Amount (₹)"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          placeholder="0.00"
          required
        />

        <Input
          type="date"
          label="Date"
          value={occurredOn}
          onChange={(e) => setOccurredOn(e.target.value)}
          error={errors.occurredOn}
          max={new Date().toISOString().split('T')[0]}
          required
        />

        <Input
          label="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          placeholder="e.g. Bank withdrawal to cash"
        />
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Transferring...' : 'Transfer Funds'}
        </Button>
      </div>
    </form>
  );
};

export default TransferModal;
