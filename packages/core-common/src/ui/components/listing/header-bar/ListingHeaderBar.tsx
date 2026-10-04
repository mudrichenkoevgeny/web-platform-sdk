import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { CoreIcon } from '@/icon/icon/CoreIcon'
import { icons } from '@/assets/icons/index.js'
import { CoreTextButton } from '@/button/text/CoreTextButton'
import { enStrings } from '@/locales/en/strings'

export interface ListingHeaderBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefreshClick?: () => void
  onOptionsClick?: () => void
  hasActiveFilters?: boolean
}

export const ListingHeaderBar = forwardRef<HTMLDivElement, ListingHeaderBarProps>(
  ({ onRefreshClick, onOptionsClick, hasActiveFilters = false, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full flex items-center justify-end gap-2 p-2', className)}
        {...rest}
      >
        {onRefreshClick && (
          <button
            type="button"
            onClick={onRefreshClick}
            aria-label={enStrings.retry}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <CoreIcon src={icons.refresh} size={20} />
          </button>
        )}

        {onOptionsClick && (
          <div className="relative">
            <CoreTextButton
              onClick={onOptionsClick}
              label={enStrings.ui_common_apply}
              className={cn(hasActiveFilters ? 'font-bold text-primary' : '')}
            />
            {hasActiveFilters && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
        )}
      </div>
    )
  }
)

ListingHeaderBar.displayName = 'ListingHeaderBar'
