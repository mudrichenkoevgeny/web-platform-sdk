import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

/**
 * Props for the {@link CoreButton} component.
 */
export interface CoreButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button label content or React element.
   */
  label: React.ReactNode
  /**
   * Shows a loading spinner instead of label when true.
   */
  isLoading?: boolean
  /**
   * Optional test tag for data-testid attribution.
   */
  'data-testid'?: string
}

/**
 * Core button component styled with design system tokens and Tailwind CSS.
 */
export const CoreButton = forwardRef<HTMLButtonElement, CoreButtonProps>(
  ({ label, isLoading = false, disabled = false, className, type = 'button', 'data-testid': testId, ...rest }, ref) => {
    const isButtonDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isButtonDisabled}
        data-testid={testId}
        className={cn(
          'w-full h-core-button rounded-lg bg-primary px-4 py-2 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
          className
        )}
        {...rest}
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
        ) : (
          label
        )}
      </button>
    )
  }
)

CoreButton.displayName = 'CoreButton'
