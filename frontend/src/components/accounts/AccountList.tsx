import React from 'react';
import type { Account } from '../../types';

interface AccountListProps {
    accounts: Account[];
    onEdit: (account: Account) => void;
    onDelete: (account: Account) => void;
    onToggleStatus: (account: Account) => void;
    isLoading?: boolean;
}

export const AccountList: React.FC<AccountListProps> = ({
    accounts,
    onEdit,
    onDelete,
    onToggleStatus,
    isLoading = false,
}) => {
    // Loading skeleton
    if (isLoading) {
        return (
            <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden animate-pulse">
                <div className="h-12 bg-surface-container-low border-b border-outline-variant"></div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 border-b border-outline-variant last:border-b-0 bg-surface-container-lowest flex items-center px-4">
                        <div className="h-4 bg-surface-container rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (accounts.length === 0) {
        return (
            <div className="text-center py-12 text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-xl">
                <div className="text-5xl mb-4">🏦</div>
                <h3 className="text-lg font-semibold text-on-surface mb-2">No accounts yet</h3>
                <p className="text-sm">Create your first bank account or cash reserve to start tracking your finances.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#F8FAFC] border-b border-outline-variant text-[#64748B] font-semibold text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-xl uppercase">ACCOUNT NAME</th>
                            <th className="px-6 py-4 uppercase">TYPE</th>
                            <th className="px-6 py-4 uppercase">CURRENT BALANCE</th>
                            <th className="px-6 py-4 uppercase">STATUS</th>
                            <th className="px-6 py-4 rounded-tr-xl text-right uppercase">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant bg-white">
                        {accounts.map((account, index) => (
                            <tr key={account.id} className="hover:bg-slate-50 transition-colors" style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}>
                                <td className="px-6 py-4 font-medium text-slate-800">
                                    {account.name}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {account.kind === 'bank' ? 'Bank' : 'Cash'}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 0
                                    }).format(account.currentBalance)}
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => onToggleStatus(account)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${account.isActive ? 'bg-[#5B5CEF]' : 'bg-slate-300'}`}
                                    >
                                        <span className="sr-only">Toggle status</span>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                account.isActive ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3 text-slate-400">
                                    <button className="hover:text-slate-600 transition-colors" title="View">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                    <button onClick={() => onEdit(account)} className="hover:text-slate-600 transition-colors" title="Edit">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                                    </button>
                                    <button onClick={() => onDelete(account)} className="hover:text-red-500 transition-colors" title="Delete">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
