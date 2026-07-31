import React from "react"
import type { Account } from "../../types"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Landmark, Banknote, Edit2, Archive, ArchiveRestore, Trash2 } from "lucide-react"

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
          <Card key={account.id} padding="none" hoverable className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isBank ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"
                  }`}
                >
                  {isBank ? <Landmark size={20} /> : <Banknote size={20} />}
                </div>
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface">{account.name}</h3>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    {isBank ? "Bank" : "Cash"}
                  </span>
                </div>
              </div>
              <Badge variant={account.isActive ? "default" : "info"}>
                {account.isActive ? "Active" : "Archived"}
              </Badge>
            </div>

            <div className="flex justify-between items-end mt-6 pt-4 border-t border-outline-variant">
              <div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Opening Balance</p>
                <p className="font-tabular-nums text-tabular-nums text-on-surface">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(account.openingBalance)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-body-sm text-body-sm text-on-surface-variant">Running Balance</p>
                <p className="font-tabular-nums text-tabular-nums text-primary font-bold text-lg">
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
                className="px-3 py-1.5 text-on-surface-variant hover:bg-surface-container rounded-md font-body-sm text-body-sm flex items-center gap-1.5 transition-colors"
                title="Edit Account"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => onToggleStatus(account)}
                className="px-3 py-1.5 text-on-surface-variant hover:bg-surface-container rounded-md font-body-sm text-body-sm flex items-center gap-1.5 transition-colors"
                title={account.isActive ? "Archive Account" : "Activate Account"}
              >
                {account.isActive ? <Archive size={16} /> : <ArchiveRestore size={16} />}
                {account.isActive ? "Archive" : "Activate"}
              </button>
              <button
                onClick={() => onDelete(account)}
                className="px-3 py-1.5 text-error hover:bg-error-container rounded-md font-body-sm text-body-sm flex items-center gap-1.5 transition-colors"
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
