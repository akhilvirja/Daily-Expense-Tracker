import React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  padding?: "none" | "sm" | "md" | "lg"
}

const paddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm transition-all ${
          hoverable ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-primary" : ""
        } ${paddingStyles[padding]} ${className || ""}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"
