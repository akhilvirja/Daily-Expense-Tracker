import React, { useState, useEffect, useCallback } from "react"
import { AccountList } from "../components/accounts/AccountList"
import { AccountForm } from "../components/accounts/AccountForm"
import Modal from "../components/ui/Modal"
import Toast from "../components/ui/Toast"
import Button from "../components/ui/Button"
import { accountApi } from "../api/accountApi"
import type { Account, CreateAccountPayload, UpdateAccountPayload } from "../types"
import { Plus } from "lucide-react"

export const AccountsPage: React.FC = () => {
  // State
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isAccountsLoading, setIsAccountsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  // Modal State
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  // Toast State
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
  })

  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToast({ isVisible: true, message, type })
  }

  // Fetch Accounts
  const fetchAccounts = useCallback(async () => {
    try {
      setIsAccountsLoading(true)
      const response = await accountApi.getAll()
      if (response.success) {
        setAccounts(response.data)
      }
    } catch (error: any) {
      showToast(error.message || "Failed to fetch accounts", "error")
    } finally {
      setIsAccountsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  // Handlers for Accounts
  const handleOpenAccountCreateModal = () => {
    setSelectedAccount(null)
    setIsAccountModalOpen(true)
  }

  const handleOpenAccountEditModal = (account: Account) => {
    setSelectedAccount(account)
    setIsAccountModalOpen(true)
  }

  const handleCloseAccountModal = () => {
    setIsAccountModalOpen(false)
    setSelectedAccount(null)
  }

  const handleAccountSubmit = async (payload: CreateAccountPayload | UpdateAccountPayload) => {
    try {
      setIsActionLoading(true)
      if (selectedAccount) {
        const response = await accountApi.update(selectedAccount.id, payload as UpdateAccountPayload)
        if (response.success) {
          showToast("Account updated successfully", "success")
          fetchAccounts()
          handleCloseAccountModal()
        }
      } else {
        const response = await accountApi.create({ ...payload, isActive: true } as CreateAccountPayload)
        if (response.success) {
          showToast("Account created successfully", "success")
          fetchAccounts()
          handleCloseAccountModal()
        }
      }
    } catch (error: any) {
      showToast(error.message || "Action failed", "error")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteAccount = async (account: Account) => {
    if (account.currentBalance !== 0) {
      showToast("Cannot delete account with a non-zero balance.", "warning")
      return
    }

    if (window.confirm(`Are you sure you want to delete "${account.name}"? This action cannot be undone.`)) {
      try {
        setIsActionLoading(true)
        const response = await accountApi.delete(account.id)
        if (response.success) {
          showToast("Account deleted successfully", "success")
          fetchAccounts()
        }
      } catch (error: any) {
        showToast(error.message || "Failed to delete account", "error")
      } finally {
        setIsActionLoading(false)
      }
    }
  }

  const handleToggleStatus = async (account: Account) => {
    try {
      const updatedIsActive = !account.isActive
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === account.id ? { ...acc, isActive: updatedIsActive } : acc))
      )

      const response = await accountApi.update(account.id, { isActive: updatedIsActive })
      if (response.success) {
        showToast(`Account turned ${updatedIsActive ? "ON" : "OFF"} successfully`, "success")
      } else {
        fetchAccounts()
        showToast("Failed to update account status", "error")
      }
    } catch (error: any) {
      fetchAccounts()
      showToast(error.message || "Failed to update account status", "error")
    }
  }

  // Filter accounts
  const displayedAccounts = accounts.filter((acc) => (showArchived ? true : acc.isActive))

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-background">Accounts</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Manage your wallets, banks, and tracking sources.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="space-y-6">
        <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
          <div className="flex items-center gap-4">
            <span className="font-body-lg text-body-lg text-on-surface font-medium">
              Total Accounts ({accounts.length})
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-outline"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Show Inactive Accounts
              </span>
            </label>
          </div>
          <Button onClick={handleOpenAccountCreateModal} icon={<Plus size={16} />}>
            Add Account
          </Button>
        </div>

        {/* Account Grid */}
        <AccountList
          accounts={displayedAccounts}
          isLoading={isAccountsLoading}
          onEdit={handleOpenAccountEditModal}
          onDelete={handleDeleteAccount}
          onToggleStatus={handleToggleStatus}
        />
      </section>

      {/* Account Create/Edit Modal */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={handleCloseAccountModal}
        title={selectedAccount ? "Edit Account" : "Add New Account"}
        size="md"
      >
        <AccountForm
          account={selectedAccount}
          onSubmit={handleAccountSubmit}
          onCancel={handleCloseAccountModal}
          isLoading={isActionLoading}
        />
      </Modal>

      {/* Toast Notifications */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}
