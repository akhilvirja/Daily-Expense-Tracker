import React from "react"
import type { Transaction } from "../../types"

interface TransactionListProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col p-8 items-center justify-center">
         <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col items-center justify-center p-16">
        <h3 className="text-title-md font-title-md text-on-surface mb-2">No transactions found</h3>
        <p className="text-body-sm font-body-sm text-on-surface-variant max-w-sm text-center">
          Get started by adding your first transaction or adjust your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
      <div className="overflow-x-auto">
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
            {transactions.map((txn) => {
              const isDebit = txn.type === "debit"
              return (
                <tr key={txn.id} className="hover:bg-surface-container transition-colors group cursor-pointer">
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
                    className={`px-6 py-4 whitespace-nowrap text-right font-tabular-nums text-tabular-nums ${
                      isDebit ? "text-error" : "text-primary-container"
                    }`}
                  >
                    {isDebit ? "-" : "+"}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(txn.amount)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination Placeholder */}
      <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between mt-auto">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing {transactions.length} transactions
        </span>
      </div>
    </div>
  )
}
