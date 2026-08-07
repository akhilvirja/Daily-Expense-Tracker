import React, { useState } from "react"
import type { Account, Category, CreateTransactionPayload, TxnType } from "../../types"
import Input from "../ui/Input"
import Button from "../ui/Button"
import Select from "../ui/Select"

interface TransactionFormProps {
  accounts: Account[]
  categories: Category[]
  onSubmit: (payload: CreateTransactionPayload) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  accounts,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [type, setType] = useState<TxnType>("debit")
  const [amount, setAmount] = useState<string>("")
  const [occurredOn, setOccurredOn] = useState<string>(
    new Date().toISOString().split("T")[0]
  )
  const [accountId, setAccountId] = useState<string>("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CreateTransactionPayload = {
      type,
      amount: parseFloat(amount),
      occurredOn: new Date(occurredOn).toISOString(),
      accountId,
      categoryId: categoryId || undefined,
      description,
    }

    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5 h-full">
      {/* Type Toggle */}
      <div className="flex bg-surface-container p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setType("debit")}
          className={`flex-1 py-2 text-center rounded-md font-title-md text-title-md transition-colors ${
            type === "debit"
              ? "bg-surface shadow-sm text-on-surface"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType("credit")}
          className={`flex-1 py-2 text-center rounded-md font-title-md text-title-md transition-colors ${
            type === "credit"
              ? "bg-surface shadow-sm text-on-surface"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Input
            label="Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="Date"
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Select
            label="Account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="Select Account"
            required
            options={[
              ...accounts.map((acc) => ({ value: acc.id, label: acc.name })),
            ]}
          />
        </div>
        <div>
          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Select Category"
            required
            options={[
              ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
            ]}
          />
        </div>
      </div>

      <div>
        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
          Description
        </label>
        <textarea
          className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-sm text-body-sm resize-none"
          placeholder="What was this for?"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant mt-auto">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !amount || !accountId || !occurredOn}>
          {isLoading ? "Saving..." : "Save Transaction"}
        </Button>
      </div>
    </form>
  )
}
