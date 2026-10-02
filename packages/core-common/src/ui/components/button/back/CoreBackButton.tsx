import { forwardRef } from 'react'
import { cn } from '../../../../utils/cn'
import { CoreIcon } from '../../icon/icon/CoreIcon'
import { icons } from '../../../../assets/icons/index.js'

export interface CoreBackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void
  icon?: React.ReactNode
  ariaLabel?: string
}

export const CoreBackButton = forwardRef<HTMLButtonElement, CoreBackButtonProps>(
  ({ onClick, disabled = false, icon, className, ariaLabel = 'Back', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          'p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50 transition-colors',
          className
        )}
        {...rest}
      >
        {icon ?? <CoreIcon src={icons.back} size={24} />}
      </button>
    )
  }
)

CoreBackButton.displayName = 'CoreBackButton'
