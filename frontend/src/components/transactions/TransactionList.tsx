import React from "react"
import type { Transaction, PaginationMeta } from "../../types"
import { Pagination } from "../ui/Pagination"

interface TransactionListProps {
  transactions: Transaction[]
  isLoading?: boolean
  pagination?: PaginationMeta
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[400px]">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold whitespace-nowrap">
                Date
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold whitespace-nowrap">
                Account
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold whitespace-nowrap">
                Type
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold whitespace-nowrap">
                Category
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold w-full min-w-[200px]">
                Description
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold text-right whitespace-nowrap">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm">Loading transactions...</p>
                  </div>
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((txn) => {
                const isDebit = txn.type === "debit"
                return (
                  <tr key={txn.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(txn.occurredOn))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          txn.account?.kind === "bank" ? "bg-primary-container" : "bg-tertiary-container"
                        }`}
                      ></span>
                      {txn.account?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md font-label-caps text-label-caps ${
                          isDebit
                            ? "bg-error-container text-on-error-container"
                            : "bg-secondary-container text-on-secondary-container"
                        }`}
                      >
                        {isDebit ? "Debit" : "Credit"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {txn.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 truncate max-w-[200px] text-on-surface">
                      {txn.description || "—"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right font-tabular-nums text-tabular-nums font-semibold ${
                        isDebit ? "text-error" : "text-primary-container"
                      }`}
                    >
                      {isDebit ? "-" : "+"}
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(txn.amount)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <h3 className="text-title-md font-title-md text-on-surface">No transactions found</h3>
                    <p className="text-body-sm font-body-sm text-on-surface-variant max-w-sm text-center">
                      Get started by adding your first transaction or adjust your filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls Fixed at Bottom */}
      {pagination && onPageChange && transactions.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[5, 10, 15, 30]}
          isLoading={isLoading}
          itemLabel="transactions"
        />
      )}
    </div>
  )
}
