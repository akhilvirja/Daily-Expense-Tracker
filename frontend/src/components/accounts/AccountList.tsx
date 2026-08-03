import React from "react"
import type { Account } from "../../types"
import Card from "../ui/Card"
import { Landmark, Banknote, Edit2, Trash2 } from "lucide-react"

interface AccountListProps {
  accounts: Account[]
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
  onToggleStatus: (account: Account) => void
  isLoading?: boolean
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse" padding="none">
            <div className="p-5 h-[200px] bg-surface-container-low" />
          </Card>
        ))}
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-surface-container-lowest border border-outline-variant rounded-xl">
        <Landmark className="text-outline mb-4" size={48} />
        <h3 className="text-title-md font-title-md text-on-surface mb-2">No accounts yet</h3>
        <p className="text-body-sm font-body-sm text-on-surface-variant max-w-sm text-center">
          Create your first bank account or cash reserve to start tracking your finances.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {accounts.map((account) => {
        const isBank = account.kind === "bank"
        return (
          <Card 
            key={account.id} 
            padding="none" 
            hoverable 
            className={`p-4 sm:p-5 transition-all ${!account.isActive ? "opacity-75 bg-surface-container-low/40" : ""}`}
          >
            <div className="flex justify-between items-start mb-4 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                    isBank ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"
                  }`}
                >
                  {isBank ? <Landmark size={20} /> : <Banknote size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-title-md text-title-md text-on-surface truncate" title={account.name}>
                    {account.name}
                  </h3>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    {isBank ? "Bank" : "Cash"}
                  </span>
                </div>
              </div>
              
              {/* Account ON / OFF Toggle Switch */}
              <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/40 flex-shrink-0">
                <span className={`text-xs font-bold uppercase tracking-wider ${account.isActive ? "text-primary" : "text-on-surface-variant"}`}>
                  {account.isActive ? "ON" : "OFF"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={account.isActive}
                  onClick={() => onToggleStatus(account)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                    account.isActive ? "bg-primary" : "bg-outline"
                  }`}
                  title={account.isActive ? "Turn Off Account" : "Turn On Account"}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      account.isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-end mt-6 pt-4 border-t border-outline-variant gap-2">
              <div className="min-w-0">
                <p className="font-body-sm text-body-sm text-on-surface-variant">Opening Balance</p>
                <p className="font-tabular-nums text-tabular-nums text-on-surface truncate">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(account.openingBalance)}
                </p>
              </div>
              <div className="text-right min-w-0 flex-shrink-0">
                <p className="font-body-sm text-body-sm text-on-surface-variant">Running Balance</p>
                <p className="font-tabular-nums text-tabular-nums text-primary font-bold text-lg truncate">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(account.currentBalance)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => onEdit(account)}
                className="px-3 py-1.5 text-on-surface-variant hover:bg-surface-container rounded-md font-body-sm text-body-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit Account"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => onDelete(account)}
                className="px-3 py-1.5 text-error hover:bg-error-container rounded-md font-body-sm text-body-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Delete Account"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
