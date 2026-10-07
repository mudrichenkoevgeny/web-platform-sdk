import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { CoreBackButton } from '@/ui/components/button/back/CoreBackButton'
import { enStrings } from '@/locales/en/strings'
import type { CoreCommonStrings } from '@/locales/en/strings'

export interface PagingFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  totalCount?: number
  strings?: CoreCommonStrings
}

export const PagingFooter = forwardRef<HTMLDivElement, PagingFooterProps>(
  (
    {
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      totalCount,
      strings = enStrings,
      className,
      ...rest
    },
    ref
  ) => {
    const page = currentPage ?? 1
    const total = totalPages ?? 1
    const hasPrevious = page > 1
    const hasNext = page < total

    return (
      <div
        ref={ref}
        className={cn(
          'w-full flex items-center justify-between p-4 border-t border-border text-sm text-surface-foreground',
          className
        )}
        {...rest}
      >
        {onPageChange && (
          <div className="flex items-center gap-1">
            <CoreBackButton
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrevious}
              ariaLabel={strings.ui_common_previous_page}
            />
            <CoreBackButton
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNext}
              ariaLabel={strings.ui_common_next_page}
              className="rotate-180"
            />
          </div>
        )}

        <div className="flex items-center gap-4 text-xs font-medium">
          <span>{strings.ui_common_page_info(page, total)}</span>
          {totalCount !== undefined && totalCount !== null && (
            <span>{strings.ui_common_total_count(totalCount)}</span>
          )}
        </div>
      </div>
    )
  }
)

PagingFooter.displayName = 'PagingFooter'
