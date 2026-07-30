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
            <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* Header skeleton */}
                <div className="h-12 bg-slate-50 border-b border-slate-200" />
                {/* Row skeletons */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center px-6 py-5 border-b border-slate-100 last:border-b-0 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-1/4" />
                        <div className="h-4 bg-slate-200 rounded w-16 ml-auto mr-8" />
                        <div className="h-4 bg-slate-200 rounded w-20 mr-8" />
                        <div className="h-4 bg-slate-200 rounded w-16" />
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (accounts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-xl">
                <div className="text-5xl mb-4">🏦</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No accounts yet</h3>
                <p className="text-sm text-slate-400 max-w-sm text-center">
                    Create your first bank account or cash reserve to start tracking your finances.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    {/* Table Header */}
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Account Name
                            </th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Current Balance
                            </th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-slate-100">
                        {accounts.map((account, index) => (
                            <tr
                                key={account.id}
                                className="hover:bg-slate-50/70 transition-colors duration-150"
                                style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
                            >
                                {/* Account Name */}
                                <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
                                    {account.name}
                                </td>

                                {/* Type */}
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                    {account.kind === 'bank' ? 'Bank' : 'Cash'}
                                </td>

                                {/* Current Balance */}
                                <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 0
                                    }).format(account.currentBalance)}
                                </td>

                                {/* Status — clickable badge to toggle active/inactive */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(account)}
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer
                                            ${account.isActive
                                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                        title={`Click to ${account.isActive ? 'deactivate' : 'activate'}`}
                                    >
                                        <span
                                            className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5
                                                ${account.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                        />
                                        {account.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>

                                {/* Actions — View, Edit, Delete */}
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="inline-flex items-center gap-1">
                                        {/* View */}
                                        <button
                                            className="p-2 text-slate-400 hover:text-[#5B5CEF] hover:bg-[#5B5CEF]/5 rounded-lg transition-all duration-150 cursor-pointer"
                                            title="View"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>

                                        {/* Edit */}
                                        <button
                                            onClick={() => onEdit(account)}
                                            className="p-2 text-slate-400 hover:text-[#5B5CEF] hover:bg-[#5B5CEF]/5 rounded-lg transition-all duration-150 cursor-pointer"
                                            title="Edit"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                <path d="m15 5 4 4" />
                                            </svg>
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => onDelete(account)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer"
                                            title="Delete"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
