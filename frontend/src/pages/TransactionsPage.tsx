import React, { useState, useEffect, useCallback } from "react"
import { transactionApi } from "../api/transactionApi"
import { accountApi } from "../api/accountApi"
import { categoryApi } from "../api/categoryApi"
import type { Transaction, Account, Category, CreateTransactionPayload, PaginationMeta } from "../types"
import { TransactionList } from "../components/transactions/TransactionList"
import { TransactionForm } from "../components/transactions/TransactionForm"
import Modal from "../components/ui/Modal"
import Toast from "../components/ui/Toast"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"
import Input from "../components/ui/Input"
import { Plus } from "lucide-react"

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  })
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filters & Pagination State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      const params: Record<string, any> = {
        page,
        limit: pageSize,
      }
      if (filterAccount) params.accountId = filterAccount
      if (filterCategory) params.categoryId = filterCategory
      if (filterType) params.type = filterType
      if (searchQuery.trim()) params.search = searchQuery.trim()

      const txRes = await transactionApi.getAll(params)

      if (txRes.success) {
        setTransactions(txRes.data)
        if (txRes.pagination) {
          setPagination(txRes.pagination)
        }
      }
    } catch (error: any) {
      showToast(error.message || "Failed to load transactions", "error")
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, filterAccount, filterCategory, filterType, searchQuery])

  // Initial load for static metadata (accounts and categories)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [accRes, catRes] = await Promise.all([
          accountApi.getAll(),
          categoryApi.getAll()
        ])
        if (accRes.success) setAccounts(accRes.data)
        if (catRes.success) setCategories(catRes.data)
      } catch (error: any) {
        showToast(error.message || "Failed to load filter data", "error")
      }
    }
    fetchMetadata()
  }, [])

  // Fetch transactions on dependency change
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

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
        fetchTransactions()
        handleCloseModal()
      }
    } catch (error: any) {
      showToast(error.message || "Failed to save transaction", "error")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1) // Reset to first page when changing page size
  }

  const handleFilterAccountChange = (val: string) => {
    setFilterAccount(val)
    setPage(1)
  }

  const handleFilterCategoryChange = (val: string) => {
    setFilterCategory(val)
    setPage(1)
  }

  const handleFilterTypeChange = (val: string) => {
    setFilterType(val)
    setPage(1)
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
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
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
        {/* Account Filter */}
        <div className="flex-1 min-w-[150px]">
          <Select
            label="Account"
            value={filterAccount}
            onChange={(e) => handleFilterAccountChange(e.target.value)}
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
            onChange={(e) => handleFilterCategoryChange(e.target.value)}
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
            onChange={(e) => handleFilterTypeChange(e.target.value)}
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
          <Input
            label="Search"
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search description..."
          />
        </div>
      </div>

      {/* Main Table Area */}
      <TransactionList 
        transactions={transactions} 
        isLoading={isLoading} 
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Transaction"
        size="md"
      >
        <TransactionForm
          accounts={accounts.filter((a) => a.isActive)}
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
