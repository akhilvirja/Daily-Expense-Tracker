import React, { useState, useEffect, useCallback } from "react"
import { transactionApi } from "../api/transactionApi"
import { accountApi } from "../api/accountApi"
import { categoryApi } from "../api/categoryApi"
import type { Transaction, Account, Category, CreateTransactionPayload } from "../types"
import { TransactionList } from "../components/transactions/TransactionList"
import { TransactionForm } from "../components/transactions/TransactionForm"
import Modal from "../components/ui/Modal"
import Toast from "../components/ui/Toast"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"
import { Plus, Search } from "lucide-react"

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filters
  const [filterAccount, setFilterAccount] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterType, setFilterType] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
  })

  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToast({ isVisible: true, message, type })
  }

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [txRes, accRes, catRes] = await Promise.all([
        transactionApi.getAll(),
        accountApi.getAll(),
        categoryApi.getAll()
      ])

      if (txRes.success) setTransactions(txRes.data)
      if (accRes.success) setAccounts(accRes.data)
      if (catRes.success) setCategories(catRes.data)
    } catch (error: any) {
      showToast(error.message || "Failed to load data", "error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (payload: CreateTransactionPayload) => {
    try {
      setIsActionLoading(true)
      const response = await transactionApi.create(payload)
      if (response.success) {
        showToast("Transaction saved successfully", "success")
        fetchData()
        handleCloseModal()
      }
    } catch (error: any) {
      showToast(error.message || "Failed to save transaction", "error")
    } finally {
      setIsActionLoading(false)
    }
  }

  // Filter logic (Client-side for now based on the design)
  const displayedTransactions = transactions.filter(txn => {
    if (filterAccount && txn.accountId !== filterAccount) return false
    if (filterCategory && txn.categoryId !== filterCategory) return false
    if (filterType && txn.type !== filterType) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!txn.description?.toLowerCase().includes(query)) return false
    }
    return true
  })

  return (
    <div className="flex-1 w-full max-w-container-max mx-auto flex flex-col min-h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-background">Transactions</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Review and manage your financial activity.
          </p>
        </div>
        <Button onClick={handleOpenModal} icon={<Plus size={20} />}>
          Add Transaction
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6 shadow-sm flex flex-wrap items-center gap-4">
        {/* Account Filter */}
        <div className="flex-1 min-w-[150px]">
          <Select
            label="Account"
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            placeholder=""
            options={[
              { value: "", label: "All Accounts" },
              ...accounts.map((acc) => ({ value: acc.id, label: acc.name }))
            ]}
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex-1 min-w-[150px]">
          <Select
            label="Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            placeholder=""
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((cat) => ({ value: cat.id, label: cat.name }))
            ]}
          />
        </div>
        
        {/* Type Filter */}
        <div className="flex-1 min-w-[120px]">
          <Select
            label="Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            placeholder=""
            options={[
              { value: "", label: "All Types" },
              { value: "debit", label: "Expense (Debit)" },
              { value: "credit", label: "Income (Credit)" }
            ]}
          />
        </div>
        
        {/* Search */}
        <div className="flex-2 min-w-[250px]">
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider opacity-0 hidden md:block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg pl-9 pr-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-sm text-body-sm h-[40px] placeholder-on-surface-variant/50" 
              placeholder="Search description..." 
            />
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <TransactionList 
        transactions={displayedTransactions} 
        isLoading={isLoading} 
      />

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Transaction"
        size="md"
      >
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isLoading={isActionLoading}
        />
      </Modal>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}
