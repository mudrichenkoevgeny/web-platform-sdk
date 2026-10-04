import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { CoreIcon } from '@/ui/components/icon/icon/CoreIcon'
import { icons } from '@/assets/icons/index.js'
import { enStrings } from '@/locales/en/strings'

export interface ListingEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

export const ListingEmptyState = forwardRef<HTMLDivElement, ListingEmptyStateProps>(
  ({ text = enStrings.ui_common_empty_list, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full flex flex-col items-center justify-center p-8 gap-3 text-center', className)}
        {...rest}
      >
        <CoreIcon src={icons.warning} size={48} className="text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      </div>
    )
  }
)

ListingEmptyState.displayName = 'ListingEmptyState'
