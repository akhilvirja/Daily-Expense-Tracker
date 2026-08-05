import React, { useState, useEffect } from 'react';
import { transactionApi } from '../../api/transactionApi';
import type { Transaction } from '../../types';
import { ChevronLeft, ChevronRight, LayoutList, ArrowDownUp } from 'lucide-react';

interface ReportTransactionTableProps {
  startDate: string;
  endDate: string;
  accountId: string;
  categoryId: string;
  type: string;
  totalCredits: number;
  totalDebits: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const ReportTransactionTable: React.FC<ReportTransactionTableProps> = ({
  startDate,
  endDate,
  accountId,
  categoryId,
  type,
  totalCredits,
  totalDebits
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const netTotal = totalCredits - totalDebits;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const params: any = {
          startDate,
          endDate,
          page,
          limit: 10,
          sort: 'occurredOn',
          order: 'desc'
        };
        if (accountId) params.accountId = accountId;
        if (categoryId) params.categoryId = categoryId;
        if (type && type !== 'All') params.type = type;

        const result = await transactionApi.getAll(params);
        setTransactions(result.data || []);
        if (result.pagination) {
          setTotalPages(result.pagination.pages);
        }
      } catch (error) {
        console.error('Failed to load transactions for report', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [startDate, endDate, accountId, categoryId, type, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, accountId, categoryId, type]);

  return (
    <div className="flex-1 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
        <div>
          <h3 className="font-title-md text-title-md font-semibold text-on-surface">Transactions Report</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Detailed view for selected period</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
             <LayoutList size={20} />
           </button>
           <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors mr-2">
             <ArrowDownUp size={20} />
           </button>
           <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
             <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="p-1 rounded bg-surface hover:bg-surface-container disabled:opacity-50"
             >
               <ChevronLeft size={20} />
             </button>
             <span className="text-xs font-medium text-on-surface-variant">Page {page} of {totalPages || 1}</span>
             <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
                className="p-1 rounded bg-surface hover:bg-surface-container disabled:opacity-50"
             >
               <ChevronRight size={20} />
             </button>
           </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
           <div className="flex items-center justify-center h-full text-on-surface-variant">
             No transactions found for these filters.
           </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface sticky top-0 z-10 border-b border-outline-variant shadow-sm">
              <tr>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant font-medium">Date</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant font-medium">Description</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant font-medium">Category</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant font-medium">Account</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
              {transactions.map(txn => (
                <tr key={txn.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="p-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
                    {formatDate(txn.occurredOn)}
                  </td>
                  <td className="p-4 font-body-sm text-body-sm text-on-surface font-medium">
                    {txn.description || (txn.billId ? 'Bill Payment' : 'No description')}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded text-xs font-medium">
                      {txn.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="p-4 font-body-sm text-body-sm text-on-surface-variant">
                    {txn.account?.name || 'Unknown'}
                  </td>
                  <td className={`p-4 font-tabular-nums text-tabular-nums text-right font-medium ${txn.type === 'credit' ? 'text-primary' : 'text-error'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(Number(txn.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Summary Footer */}
      <div className="bg-surface-bright border-t border-outline-variant p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
        <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant shadow-sm flex flex-col justify-center">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Total Credits</p>
          <p className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-primary">
            +{formatCurrency(totalCredits)}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant shadow-sm flex flex-col justify-center">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Total Debits</p>
          <p className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-error">
            -{formatCurrency(totalDebits)}
          </p>
        </div>
        <div className="bg-primary-container p-4 rounded-lg shadow-sm flex flex-col justify-center">
          <p className="font-label-caps text-label-caps text-on-primary-container mb-1 opacity-80">Net Total</p>
          <p className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-on-primary-container">
            {netTotal >= 0 ? '+' : ''}{formatCurrency(netTotal)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportTransactionTable;
