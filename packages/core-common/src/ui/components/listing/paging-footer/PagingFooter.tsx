import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { CoreBackButton } from '@/ui/components/button/back/CoreBackButton'
import { enStrings } from '@/locales/en/strings'

export interface PagingFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalCount?: number
}

export const PagingFooter = forwardRef<HTMLDivElement, PagingFooterProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      totalCount,
      className,
      ...rest
    },
    ref
  ) => {
    const hasPrevious = currentPage > 1
    const hasNext = currentPage < totalPages

    return (
      <div
        ref={ref}
        className={cn(
          'w-full flex items-center justify-between p-4 border-t border-border text-sm text-surface-foreground',
          className
        )}
        {...rest}
      >
        <div className="flex items-center gap-1">
          <CoreBackButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevious}
            ariaLabel="Previous page"
          />
          <CoreBackButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            ariaLabel="Next page"
            className="rotate-180"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <span>{enStrings.ui_common_page_info(currentPage, totalPages)}</span>
          {totalCount !== undefined && (
            <span>{enStrings.ui_common_total_count(totalCount)}</span>
          )}
        </div>
      </div>
    )
  }
)

PagingFooter.displayName = 'PagingFooter'
