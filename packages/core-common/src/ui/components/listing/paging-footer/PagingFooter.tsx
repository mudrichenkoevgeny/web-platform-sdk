import React, { forwardRef } from 'react'
import { CommonModuleStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@/utils/cn'
import { CoreBackButton } from '@/ui/components/button/back/CoreBackButton'

export interface PagingFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  totalCount?: number
  strings?: CommonModuleStrings
}

export const PagingFooter = forwardRef<HTMLDivElement, PagingFooterProps>(
  (
    {
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      totalCount,
      strings = commonStrings,
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
              ariaLabel={strings.ui.previousPage}
            />
            <CoreBackButton
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNext}
              ariaLabel={strings.ui.nextPage}
              className="rotate-180"
            />
          </div>
        )}

        <div className="flex items-center gap-4 text-xs font-medium">
          <span>{strings.ui.pageInfo(page, total)}</span>
          {totalCount !== undefined && totalCount !== null && (
            <span>{strings.ui.totalCount(totalCount)}</span>
          )}
        </div>
      </div>
    )
  }
)

PagingFooter.displayName = 'PagingFooter'
