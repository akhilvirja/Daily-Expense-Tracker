import { Filter } from 'lucide-react';

import type { Account } from '../../api/accountApi';
import type { Category } from '../../api/categoryApi';

interface ReportFilterPanelProps {
  startDate: string;
  endDate: string;
  accountId: string;
  categoryId: string;
  type: string;
  accounts: Account[];
  categories: Category[];
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onAccountIdChange: (id: string) => void;
  onCategoryIdChange: (id: string) => void;
  onTypeChange: (type: string) => void;
}

const ReportFilterPanel: React.FC<ReportFilterPanelProps> = ({
  startDate,
  endDate,
  accountId,
  categoryId,
  type,
  accounts,
  categories,
  onStartDateChange,
  onEndDateChange,
  onAccountIdChange,
  onCategoryIdChange,
  onTypeChange,
}) => {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-primary" />
        <h3 className="font-title-md text-title-md font-semibold text-on-surface">Filters</h3>
      </div>
      
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full sm:w-auto ml-0 sm:ml-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium text-on-surface-variant w-12 sm:w-auto">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium text-on-surface-variant w-12 sm:w-auto">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
      </div>
      
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 ml-0 sm:ml-4 border-t sm:border-t-0 sm:border-l border-outline-variant pt-4 sm:pt-0 sm:pl-4">
        <select
          value={accountId}
          onChange={(e) => onAccountIdChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">All Accounts</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
        
        <select
          value={categoryId}
          onChange={(e) => onCategoryIdChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="All">All Types</option>
          <option value="debit">Expense</option>
          <option value="credit">Income</option>
        </select>
      </div>
    </div>
  );
};

export default ReportFilterPanel;
