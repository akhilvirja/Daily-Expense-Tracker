import React, { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import ConfirmModal from "../ui/ConfirmModal"
import {
  LayoutDashboard,
  Wallet,
  ReceiptText,
  Tags,
  Truck,
  CreditCard,
  BarChart2,
  WalletCards,
  X,
  LogOut
} from "lucide-react"

interface NavItem {
  path: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/accounts", label: "Accounts", icon: Wallet },
  { path: "/transactions", label: "Transactions", icon: ReceiptText },
  { path: "/categories", label: "Categories", icon: Tags },
  { path: "/trackers", label: "Trackers", icon: Truck },
  { path: "/billing", label: "Bills", icon: CreditCard },
  { path: "/reports", label: "Reports", icon: BarChart2 },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

  const handleSignOutConfirm = () => {
    logout()
    window.location.href = "/login"
  }

  const renderNavLink = (item: NavItem) => {
    const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
    const Icon = item.icon

    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          onClick={() => {
            if (window.innerWidth < 768) {
              onClose()
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-title-md text-title-md ${
            isActive
              ? "bg-secondary-container text-on-secondary-container"
              : "text-on-surface-variant hover:bg-surface-container-high hover:bg-surface-container-highest"
          }`}
        >
          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-on-secondary-container" : "text-on-surface-variant"} />
          {item.label}
        </NavLink>
      </li>
    )
  }

  return (
    <nav
      className={`fixed left-0 top-0 h-screen w-64 p-4 z-40 bg-surface-container-low border-r border-outline-variant flex flex-col transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <WalletCards size={28} className="text-primary" />
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary">Ledgerly</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Calm Finance</p>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden text-on-surface-variant hover:bg-surface-container p-1 rounded-lg"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <ul className="flex flex-col gap-1 flex-grow overflow-y-auto">
        {navItems.map(renderNavLink)}
      </ul>

      <div className="mt-auto pt-4">
        <button
          onClick={() => setIsSignOutModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all font-title-md text-title-md"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </div>
      <ConfirmModal
        isOpen={isSignOutModalOpen}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        onConfirm={handleSignOutConfirm}
        onCancel={() => setIsSignOutModalOpen(false)}
      />
    </nav>
  )
}
