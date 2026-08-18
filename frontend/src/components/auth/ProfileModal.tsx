import React, { useState, useEffect } from "react"
import Input from "../ui/Input"
import Button from "../ui/Button"
import Modal from "../ui/Modal"
import { useAuth } from "../../context/AuthContext"
import { authApi } from "../../api/authApi"
import Toast from "../ui/Toast"
import { Eye, EyeOff } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = "profile" | "security"

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth()
  
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  // Profile Form State
  const [profileData, setProfileData] = useState({ fullName: "" })
  const [profileError, setProfileError] = useState<string>("")
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const [toast, setToast] = useState({ isVisible: false, message: "", type: "info" as "success" | "error" })

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setProfileData({ fullName: user.fullName || "" })
      }
      setProfileError("")
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
      setPasswordErrors({})
      setActiveTab("profile")
    }
  }, [user, isOpen])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profileData.fullName.trim()) {
      setProfileError("Full name is required")
      return
    }
    
    if (profileData.fullName.trim().length < 2) {
      setProfileError("Full name must be at least 2 characters")
      return
    }

    try {
      setIsProfileLoading(true)
      const response = await authApi.updateProfile({ fullName: profileData.fullName.trim() })
      if (response.success) {
        updateUser({ fullName: response.data?.fullName })
        setToast({ isVisible: true, message: "Profile updated successfully", type: "success" })
        setTimeout(() => onClose(), 1500)
      }
    } catch (err: any) {
      setToast({ isVisible: true, message: err.message || "Failed to update profile", type: "error" })
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors: Record<string, string> = {}
    if (!passwordData.currentPassword) errors.currentPassword = "Required"
    if (!passwordData.newPassword) {
      errors.newPassword = "Required"
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Must be at least 6 characters"
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match"
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    try {
      setIsPasswordLoading(true)
      const response = await authApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      if (response.success) {
        setToast({ isVisible: true, message: "Password updated successfully", type: "success" })
        setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
        setPasswordErrors({})
        setTimeout(() => onClose(), 1500)
      }
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
         const newErrors: Record<string, string> = {}
         err.errors.forEach((e: any) => { newErrors[e.field] = e.message })
         setPasswordErrors(newErrors)
      } else {
         setToast({ isVisible: true, message: err.message || "Failed to update password", type: "error" })
      }
    } finally {
      setIsPasswordLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="sm">
        {/* Tabs */}
        <div className="flex bg-surface-container-low rounded-lg p-1 mb-6" role="tablist">
            <button
                aria-selected={activeTab === "profile"}
                className={`flex-1 py-2 px-4 rounded-md font-body-sm text-body-sm font-medium transition-all duration-200 ${
                  activeTab === "profile" 
                  ? "bg-surface-container-lowest shadow-sm text-on-surface" 
                  : "text-on-surface-variant hover:text-on-surface"
                }`}
                role="tab"
                type="button"
                onClick={() => setActiveTab("profile")}
            >
                Profile Info
            </button>
            <button
                aria-selected={activeTab === "security"}
                className={`flex-1 py-2 px-4 rounded-md font-body-sm text-body-sm font-medium transition-all duration-200 ${
                  activeTab === "security" 
                  ? "bg-surface-container-lowest shadow-sm text-on-surface" 
                  : "text-on-surface-variant hover:text-on-surface"
                }`}
                role="tab"
                type="button"
                onClick={() => setActiveTab("security")}
            >
                Security
            </button>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="flex flex-col h-full animate-in fade-in duration-200">
            <div className="space-y-4">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="e.g., John Doe"
                value={profileData.fullName}
                onChange={(e) => {
                  setProfileData({ fullName: e.target.value })
                  setProfileError("")
                }}
                error={profileError}
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isProfileLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isProfileLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col h-full animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type={showPasswords ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData(p => ({ ...p, currentPassword: e.target.value }))
                    setPasswordErrors(p => ({ ...p, currentPassword: "" }))
                  }}
                  error={passwordErrors.currentPassword}
                />
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  name="newPassword"
                  type={showPasswords ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData(p => ({ ...p, newPassword: e.target.value }))
                    setPasswordErrors(p => ({ ...p, newPassword: "" }))
                  }}
                  error={passwordErrors.newPassword}
                />
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type={showPasswords ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => {
                    setPasswordData(p => ({ ...p, confirmNewPassword: e.target.value }))
                    setPasswordErrors(p => ({ ...p, confirmNewPassword: "" }))
                  }}
                  error={passwordErrors.confirmNewPassword}
                />
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-none"
                >
                  {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{showPasswords ? "Hide Passwords" : "Show Passwords"}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPasswordLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isPasswordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  )
}
