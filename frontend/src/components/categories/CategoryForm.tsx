import React, { useState, useEffect } from "react"
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../../types"
import Input from "../ui/Input"
import Button from "../ui/Button"

interface CategoryFormProps {
  category?: Category | null
  onSubmit: (payload: CreateCategoryPayload | UpdateCategoryPayload) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState("")

  useEffect(() => {
    if (category) {
      setName(category.name)
    } else {
      setName("")
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ name })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="space-y-4">
        <Input
          label="Category Name"
          placeholder="e.g., Groceries"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>

      {/* Spacing to push footer to bottom if inside flex container */}
      <div className="flex-1 min-h-[2rem]"></div>

      <div className="pt-6 border-t border-outline-variant flex justify-end gap-3 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Saving..." : "Save Category"}
        </Button>
      </div>
    </form>
  )
}
