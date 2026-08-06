import React, { useState, useEffect } from 'react';
import type { TrackerItemWithLog } from '../../api/trackerApi';

interface DailyLogRowProps {
  item: TrackerItemWithLog;
  logDate: string;
  onUpdate: (itemId: string, quantity: number, amount: number) => Promise<void>;
}

const renderLogStatusBadge = (status?: string) => {
  switch (status) {
    case 'billed_paid':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-label-caps bg-secondary-container text-on-secondary-container font-semibold uppercase tracking-wider">
          Paid
        </span>
      );
    case 'billed_unpaid':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-label-caps bg-error-container text-on-error-container font-semibold uppercase tracking-wider">
          Billed (Unpaid)
        </span>
      );
    case 'unbilled':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-label-caps bg-surface-container-high text-on-surface-variant font-medium uppercase tracking-wider">
          Unbilled
        </span>
      );
  }
};

const DailyLogRow: React.FC<DailyLogRowProps> = ({ item, logDate, onUpdate }) => {
  const initialQuantity = item.log ? item.log.quantity : 0;
  const initialAmount = item.log ? item.log.amount : 0;

  const [quantity, setQuantity] = useState<number>(Number(initialQuantity));
  const [amount, setAmount] = useState<number>(Number(initialAmount));
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Sync state if props change (e.g. date changes)
  useEffect(() => {
    setQuantity(item.log ? Number(item.log.quantity) : 0);
    setAmount(item.log ? Number(item.log.amount) : 0);
  }, [item, logDate]);

  const handleUpdate = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    // Auto calculate amount if price is set
    const newAmount = item.price ? newQuantity * Number(item.price) : amount;
    
    setQuantity(newQuantity);
    setAmount(newAmount);
    
    try {
      setIsUpdating(true);
      await onUpdate(item.itemId, newQuantity, newAmount);
    } catch (error) {
      console.error('Failed to update log', error);
      // Revert on failure
      setQuantity(quantity);
      setAmount(amount);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) return;
    
    setAmount(val);
  };

  const handleAmountBlur = async () => {
    if (amount !== (item.log ? Number(item.log.amount) : 0)) {
      try {
        setIsUpdating(true);
        await onUpdate(item.itemId, quantity, amount);
      } catch (error) {
        console.error('Failed to update amount', error);
        setAmount(item.log ? Number(item.log.amount) : 0);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className={`flex flex-col sm:grid sm:grid-cols-12 gap-4 p-4 items-center hover:bg-surface-bright transition-colors ${isUpdating ? 'opacity-70' : ''}`}>
      <div className="col-span-5 w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-body-lg text-body-lg text-on-surface font-medium">{item.name}</p>
          {item.log && renderLogStatusBadge(item.log.status)}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {item.price ? `₹${Number(item.price).toFixed(2)} / ${item.unit}` : `Unit: ${item.unit}`}
        </p>
      </div>
      
      <div className="col-span-3 w-full flex items-center">
        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden h-10 bg-surface-container-lowest w-full sm:w-32">
          <button 
            type="button"
            className="px-3 text-on-surface-variant hover:bg-surface-container transition-colors"
            onClick={() => handleUpdate(quantity - 1)}
            disabled={isUpdating || quantity <= 0}
          >
            -
          </button>
          <input 
            className="w-full text-center border-none p-0 h-full font-tabular-nums text-tabular-nums text-on-surface focus:ring-0" 
            type="number" 
            value={quantity}
            readOnly // Managed by +/- for now to simplify update logic, or we can make it editable
            // If making editable, handle onBlur like amount
          />
          <button 
            type="button"
            className="px-3 text-on-surface-variant hover:bg-surface-container transition-colors"
            onClick={() => handleUpdate(quantity + 1)}
            disabled={isUpdating}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="col-span-4 w-full text-right flex justify-between sm:block">
        <span className="sm:hidden font-label-caps text-label-caps text-on-surface-variant self-center">Amount</span>
        <div className="flex justify-end items-center">
          <span className="font-tabular-nums text-tabular-nums text-on-surface font-semibold text-lg mr-1">₹</span>
          <input
            type="number"
            step="0.01"
            className="w-24 text-right border-none bg-transparent p-0 font-tabular-nums text-tabular-nums text-on-surface font-semibold text-lg focus:ring-0 focus:border-b focus:border-primary"
            value={amount}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            disabled={isUpdating}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyLogRow;
