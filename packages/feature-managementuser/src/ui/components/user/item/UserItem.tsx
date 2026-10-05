import React, { forwardRef } from 'react'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'

export interface UserItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  user: UserDetails
  onClick: () => void
  strings?: FeatureManagementUserStrings
}

export const UserItem = forwardRef<HTMLButtonElement, UserItemProps>(
  (
    {
      user,
      onClick,
      strings = enManagementUserStrings,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        type="button"
        ref={ref}
        data-testid={`UserItem_${user.id}`}
        onClick={onClick}
        className={cn(
          'text-left relative w-full p-4 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex flex-col gap-2 shadow-sm cursor-pointer',
          className
        )}
        {...rest}
      >
        <div className="text-sm font-bold text-surface-foreground">
          {strings.user_id(user.id)}
        </div>
        <div className="text-xs text-muted-foreground">
          {strings.user_role}: {user.role}
        </div>
        <div className="text-xs text-muted-foreground">
          {strings.user_account_status}: {user.accountStatus}
        </div>
      </button>
    )
  }
)

UserItem.displayName = 'UserItem'
