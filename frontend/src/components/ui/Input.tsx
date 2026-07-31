import React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="font-title-md text-title-md text-on-surface">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`flex h-10 w-full rounded-lg border bg-surface-container-lowest px-3 py-2 font-body-lg text-body-lg text-on-surface file:border-0 file:bg-transparent file:font-medium placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
            error
              ? "border-error focus-visible:ring-error"
              : "border-outline-variant focus-visible:ring-primary focus-visible:border-primary"
          } ${className || ""}`}
          {...props}
        />
        {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
        {helperText && !error && (
          <span className="font-body-sm text-body-sm text-on-surface-variant">{helperText}</span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"
