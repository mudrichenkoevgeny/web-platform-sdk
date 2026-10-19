import React, { forwardRef } from 'react'
import { commonStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@/utils/cn'
import { CoreIcon } from '@/ui/components/icon/icon/CoreIcon'
import { icons } from '@/assets/icons'
import { CoreTextButton } from '@/ui/components/button/text/CoreTextButton'

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
            aria-label={commonStrings.ui.refresh}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <CoreIcon src={icons.refresh} size={20} />
          </button>
        )}

        {onOptionsClick && (
          <div className="relative">
            <CoreTextButton
              onClick={onOptionsClick}
              label={userStrings.ui.filter}
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
