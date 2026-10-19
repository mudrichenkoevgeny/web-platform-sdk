import React, { forwardRef } from 'react'
import { UserModuleStrings, userStrings, type UserSummary } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export interface UserItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  user: UserSummary
  onClick: () => void
  strings?: UserModuleStrings
}

export const UserItem = forwardRef<HTMLButtonElement, UserItemProps>(
  (
    {
      user,
      onClick,
      strings = userStrings,
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
          {user.id ?? ''}
        </div>
        <div className="text-xs text-muted-foreground">
          {strings.ui.userRole}: {user.role}
        </div>
        <div className="text-xs text-muted-foreground">
          {strings.ui.userAccountStatus}: {user.accountStatus}
        </div>
      </button>
    )
  }
)

UserItem.displayName = 'UserItem'
