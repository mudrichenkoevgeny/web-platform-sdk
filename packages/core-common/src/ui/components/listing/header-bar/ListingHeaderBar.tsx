import React, { forwardRef } from 'react'
import { commonStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@/utils/cn'
import { CoreIcon } from '@/ui/components/icon/icon/CoreIcon'
import { icons } from '@/assets/icons'
import { CoreTextButton } from '@/ui/components/button/text/CoreTextButton'

/**
 * Props for {@link ListingHeaderBar}.
 */
export interface ListingHeaderBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Callback invoked when the refresh button is clicked. */
  onRefreshClick?: () => void
  /** Callback invoked when the options/filters button is clicked. */
  onOptionsClick?: () => void
  /** Callback invoked when the add/upload button is clicked. */
  onAddClick?: () => void
  /** Accessible aria-label for the add button. */
  addAriaLabel?: string
  /** Whether any active filters are applied to highlight the filter toggle. */
  hasActiveFilters?: boolean
}

/**
 * Header bar component for listings providing action buttons for adding, refreshing, and toggling filter options.
 *
 * @param props - Component properties configuring action callbacks and filter indicator state.
 * @param ref - Optional forwarding ref bound to root container element.
 * @returns React node rendering listing header bar.
 */
export const ListingHeaderBar = forwardRef<HTMLDivElement, ListingHeaderBarProps>(
  ({ onRefreshClick, onOptionsClick, onAddClick, addAriaLabel, hasActiveFilters = false, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full flex items-center justify-end gap-2 p-2', className)}
        {...rest}
      >
        {onAddClick && (
          <button
            type="button"
            onClick={onAddClick}
            aria-label={addAriaLabel ?? commonStrings.ui.refresh}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <CoreIcon src={icons.add} size={20} />
          </button>
        )}

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
