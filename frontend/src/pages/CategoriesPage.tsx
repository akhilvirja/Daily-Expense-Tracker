import React, { useState, useEffect, useCallback } from "react"
import { categoryApi } from "../api/categoryApi"
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../types"
import { CategoryList } from "../components/categories/CategoryList"
import { CategoryForm } from "../components/categories/CategoryForm"
import Modal from "../components/ui/Modal"
import ConfirmModal from "../components/ui/ConfirmModal"
import Toast from "../components/ui/Toast"
import Button from "../components/ui/Button"
import { Plus } from "lucide-react"

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
  })

  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToast({ isVisible: true, message, type })
  }

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await categoryApi.getAll()
      if (response.success) {
        setCategories(response.data)
      }
    } catch (error: any) {
      showToast(error.message || "Failed to fetch categories", "error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleOpenCreateModal = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleSubmit = async (payload: CreateCategoryPayload | UpdateCategoryPayload) => {
    try {
      setIsActionLoading(true)
      if (selectedCategory) {
        const response = await categoryApi.update(selectedCategory.id, payload as UpdateCategoryPayload)
        if (response.success) {
          showToast("Category updated successfully", "success")
          fetchCategories()
          handleCloseModal()
        }
      } else {
        const response = await categoryApi.create(payload as CreateCategoryPayload)
        if (response.success) {
          showToast("Category created successfully", "success")
          fetchCategories()
          handleCloseModal()
        }
      }
    } catch (error: any) {
      showToast(error.message || "Action failed", "error")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteCategoryRequest = (category: Category) => {
    setCategoryToDelete(category)
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

      try {
        setIsActionLoading(true)
        const response = await categoryApi.delete(category.id)
        if (response.success) {
          showToast("Category deleted successfully", "success")
          fetchCategories()
        }
      } catch (error: any) {
        showToast(error.message || "Failed to delete category", "error")
      } finally {
        setIsActionLoading(false)
        setCategoryToDelete(null)
      }
  }

  return (
    <div className="flex-1 w-full max-w-container-max mx-auto flex flex-col min-h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-background">Categories</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Manage tags used to organize your transactions.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} icon={<Plus size={20} />}>
          Add Category
        </Button>
      </div>

      <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant mb-6 shadow-sm">
        <span className="font-body-lg text-body-lg text-on-surface font-medium">
          Total Categories ({categories.length})
        </span>
      </div>

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteCategoryRequest}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory ? "Edit Category" : "Add New Category"}
        size="md"
      >
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isActionLoading}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
        confirmText={isActionLoading ? "Deleting..." : "Delete"}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCategoryToDelete(null)}
        isDestructive={true}
      />

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
