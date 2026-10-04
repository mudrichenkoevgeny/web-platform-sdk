import React, { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

export interface CoreOutlinedTextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label?: React.ReactNode
  placeholder?: string
  isError?: boolean
  errorText?: React.ReactNode
  helperText?: React.ReactNode
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

export const CoreOutlinedTextField = forwardRef<
  HTMLInputElement,
  CoreOutlinedTextFieldProps
>(
  (
    {
      label,
      placeholder,
      isError = false,
      errorText,
      helperText,
      leadingIcon,
      trailingIcon,
      disabled,
      className,
      id,
      type = 'text',
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="text-sm font-medium text-surface-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 flex items-center justify-center text-muted-foreground pointer-events-none">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={fieldId}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              'w-full h-core-button rounded-lg border bg-surface px-4 py-2 text-base text-surface-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
              leadingIcon ? 'pl-10' : 'pl-4',
              trailingIcon ? 'pr-10' : 'pr-4',
              isError ? 'border-error focus:ring-error' : 'border-border',
              className
            )}
            {...rest}
          />
          {trailingIcon && (
            <span className="absolute right-3 flex items-center justify-center text-muted-foreground">
              {trailingIcon}
            </span>
          )}
        </div>
        {isError && errorText ? (
          <span className="text-xs text-error font-medium">{errorText}</span>
        ) : helperText ? (
          <span className="text-xs text-muted-foreground">{helperText}</span>
        ) : null}
      </div>
    )
  }
)

CoreOutlinedTextField.displayName = 'CoreOutlinedTextField'
