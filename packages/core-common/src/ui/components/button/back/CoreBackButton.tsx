import { forwardRef } from 'react'
import { commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@/utils/cn'
import { CoreIcon } from '@/ui/components/icon/icon/CoreIcon'
import { icons } from '@/assets/icons'

export interface CoreBackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void
  icon?: React.ReactNode
  ariaLabel?: string
}

export const CoreBackButton = forwardRef<HTMLButtonElement, CoreBackButtonProps>(
  ({ onClick, disabled = false, icon, className, ariaLabel = commonStrings.ui.back, ...rest }, ref) => {
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
