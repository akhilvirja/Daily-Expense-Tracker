import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { Bill } from '../../api/billApi';
import type { Account } from '../../api/accountApi';

interface PayBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (accountId: string, paidOn: string, remarks?: string) => Promise<void>;
  bill: Bill | null;
  accounts: Account[];
}

const PayBillModal: React.FC<PayBillModalProps> = ({ isOpen, onClose, onPay, bill, accounts }) => {
  const [accountId, setAccountId] = useState('');
  const [paidOn, setPaidOn] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setAccountId('');
      setPaidOn(new Date().toISOString().split('T')[0]);
      setRemarks('');
      setError(null);
    }
  }, [isOpen]);

  if (!bill) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) {
      setError('Please select an account');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onPay(accountId, paidOn, remarks);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pay Bill"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-on-error-container bg-error-container rounded-lg">
            {error}
          </div>
        )}
        
        <div className="bg-surface-container-low p-4 rounded-lg mb-4">
          <p className="font-title-md text-title-md text-on-surface mb-1">
            {bill.item.name}
          </p>
          <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
            <span>Amount to pay</span>
            <span className="font-tabular-nums font-semibold text-lg text-on-surface">
              ₹{Number(bill.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        <div>
          <label className="block font-body-sm text-body-sm text-on-surface mb-1">
            Select Account <span className="text-error">*</span>
          </label>
          <select 
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="" disabled>Choose an account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} - ₹{Number(acc.currentBalance || 0).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block font-body-sm text-body-sm text-on-surface mb-1">Paid-on Date</label>
          <input 
            type="date"
            value={paidOn}
            onChange={(e) => setPaidOn(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>
        
        <div>
          <label className="block font-body-sm text-body-sm text-on-surface mb-1">Remarks</label>
          <textarea 
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
            placeholder="Optional notes..."
            rows={2}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-surface-container-highest">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Confirm Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PayBillModal;
