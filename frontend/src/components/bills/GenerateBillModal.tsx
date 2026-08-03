import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { TrackerItem } from '../../api/trackerApi';

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (itemId: string, periodStart: string, periodEnd: string) => Promise<void>;
  items: TrackerItem[];
}

const GenerateBillModal: React.FC<GenerateBillModalProps> = ({ isOpen, onClose, onGenerate, items }) => {
  const [itemId, setItemId] = useState('');
  
  // Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const [periodStart, setPeriodStart] = useState(firstDay);
  const [periodEnd, setPeriodEnd] = useState(lastDay);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setItemId('');
      setPeriodStart(firstDay);
      setPeriodEnd(lastDay);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) {
      setError('Please select an item');
      return;
    }
    
    if (periodStart > periodEnd) {
      setError('Start date cannot be after end date');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onGenerate(itemId, periodStart, periodEnd);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to generate bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate New Bill"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-on-error-container bg-error-container rounded-lg">
            {error}
          </div>
        )}
        
        <div>
          <label className="block font-body-sm text-body-sm text-on-surface mb-1">
            Select Item <span className="text-error">*</span>
          </label>
          <select 
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="" disabled>Choose an item to bill</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.unit})
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body-sm text-body-sm text-on-surface mb-1">From Date</label>
            <input 
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-body-sm text-body-sm text-on-surface mb-1">To Date</label>
            <input 
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-surface-container-highest">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Generate Bill
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GenerateBillModal;
