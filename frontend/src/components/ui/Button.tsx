import React from "react"

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline"
export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-[#005049] hover:shadow-md",
  secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
  danger: "bg-error text-on-error hover:bg-[#93000a] hover:shadow-md",
  ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container",
  outline: "bg-transparent border border-outline-variant text-on-surface-variant hover:bg-surface-container",
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-body-sm gap-1.5",
  md: "h-10 px-4 text-title-md gap-2",
  lg: "h-12 px-6 text-title-md gap-2.5",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium font-sans transition-all rounded-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className || ""}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
        ) : icon ? (
          <span className="inline-flex items-center justify-center">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export default Button;
