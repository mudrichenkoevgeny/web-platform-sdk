import React, { forwardRef } from 'react'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Props for the {@link IdentifierItem} component.
 */
export interface IdentifierItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * User identifier domain object to display.
   */
  identifier: UserIdentifier
  /**
   * Callback invoked when the identifier item card is clicked.
   */
  onClick?: () => void
  /**
   * Indicates if this identifier is the active session's identifier.
   */
  isCurrentIdentifier?: boolean
}

/**
 * List item representing a single user identifier (e.g. email address or phone number).
 */
export const IdentifierItem = forwardRef<HTMLDivElement, IdentifierItemProps>(
  (
    {
      identifier,
      onClick,
      isCurrentIdentifier = false,
      className,
      ...rest
    },
    ref
  ) => {
    const isClickable = Boolean(onClick)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick()
      }
    }

    return (
      <div
        ref={ref}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full p-4 rounded-lg border transition-colors flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
          isClickable ? 'cursor-pointer hover:bg-accent/50' : '',
          isCurrentIdentifier
            ? 'bg-primary/10 border-primary text-primary-foreground'
            : 'bg-card border-border',
          className
        )}
        {...rest}
      >
        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-surface-foreground">
            {identifier.displayName}
          </span>
          <span className="text-xs text-muted-foreground">
            {identifier.userAuthProvider}
          </span>
        </div>
      </div>
    )
  }
)

IdentifierItem.displayName = 'IdentifierItem'
