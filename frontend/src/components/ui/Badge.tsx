import React from "react"

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-container text-on-surface-variant",
  primary: "bg-primary-container text-on-primary-container",
  success: "bg-secondary-container text-on-secondary-container",
  warning: "bg-tertiary-container text-on-tertiary-container",
  danger: "bg-error-container text-on-error-container",
  info: "bg-surface-variant text-on-surface-variant",
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-label-caps whitespace-nowrap ${
          variantStyles[variant]
        } ${className || ""}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"
