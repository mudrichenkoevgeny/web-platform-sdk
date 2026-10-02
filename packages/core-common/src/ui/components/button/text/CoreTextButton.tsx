import React, { forwardRef } from 'react'
import { cn } from '../../../../utils/cn'

export interface CoreTextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export const CoreTextButton = forwardRef<HTMLButtonElement, CoreTextButtonProps>(
  ({ label, disabled = false, className, type = 'button', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'h-core-button px-3 py-1.5 text-sm font-medium text-primary hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...rest}
      >
        {label}
      </button>
    )
  }
)

CoreTextButton.displayName = 'CoreTextButton'
