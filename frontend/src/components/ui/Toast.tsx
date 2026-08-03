import React, { useEffect } from "react"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastProps {
  message: string
  type?: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
}

const toastStyles: Record<ToastType, { bg: string; icon: React.ElementType }> = {
  success: { bg: "bg-surface-container-highest text-on-surface", icon: CheckCircle },
  error: { bg: "bg-error-container text-on-error-container", icon: AlertCircle },
  warning: { bg: "bg-tertiary-container text-on-tertiary-container", icon: AlertTriangle },
  info: { bg: "bg-inverse-surface text-inverse-on-surface", icon: Info },
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const styles = toastStyles[type]
  const Icon = styles.icon

  return (
    <div
      className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg font-body-lg text-body-lg max-w-[400px] animate-in slide-in-from-bottom-5 fade-in duration-300 ${styles.bg}`}
    >
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="flex items-center justify-center rounded-md p-1 opacity-80 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        aria-label="Close toast"
      >
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast;
