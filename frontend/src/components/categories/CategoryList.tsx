import React from "react"
import type { Category } from "../../types"
import Card from "../ui/Card"
import { Tags, Edit2, Trash2 } from "lucide-react"

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  isLoading?: boolean
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse" padding="none">
            <div className="p-5 h-[100px] bg-surface-container-low" />
          </Card>
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-surface-container-lowest border border-outline-variant rounded-xl">
        <Tags className="text-outline mb-4" size={48} />
        <h3 className="text-title-md font-title-md text-on-surface mb-2">No categories yet</h3>
        <p className="text-body-sm font-body-sm text-on-surface-variant max-w-sm text-center">
          Create categories to organize and track your transactions efficiently.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.id} padding="none" hoverable className="p-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-container text-on-primary-container">
                <Tags size={20} />
              </div>
              <h3 className="font-title-md text-title-md text-on-surface">{category.name}</h3>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(category)}
                className="p-2 text-on-surface-variant hover:bg-surface-container rounded-md transition-colors"
                title="Edit Category"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(category)}
                className="p-2 text-error hover:bg-error-container rounded-md transition-colors"
                title="Delete Category"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
