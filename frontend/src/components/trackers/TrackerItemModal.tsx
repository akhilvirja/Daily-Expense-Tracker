import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { TrackerItem } from '../../api/trackerApi';

interface TrackerItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TrackerItem, 'id' | 'isActive'>) => Promise<void>;
  item?: TrackerItem | null;
}

const TrackerItemModal: React.FC<TrackerItemModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setUnit(item.unit);
      setPrice(item.price ? item.price.toString() : '');
    } else {
      setName('');
      setUnit('');
      setPrice('');
    }
    setError(null);
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !unit || !price) {
      setError('Name, Unit, and Price are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        name,
        unit,
        price: parseFloat(price),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Tracker Item' : 'Add Tracker Item'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 text-sm text-on-error-container bg-error-container rounded-lg">
            {error}
          </div>
        )}
        
        <Input
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Farm Fresh Milk"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g. Litre, Copy, Kg"
            required
          />
          
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 2.50"
            required
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {item ? 'Save Changes' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TrackerItemModal;
