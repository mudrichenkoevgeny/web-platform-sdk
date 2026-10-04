import React, { forwardRef } from 'react'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon, formatEpochMillisToDateTime } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { icons } from '@/assets/icons/index'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Props for the {@link SessionItem} component.
 */
export interface SessionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * User session domain object to display.
   */
  session: UserSession
  /**
   * Callback invoked when the revoke button is clicked.
   */
  onRevokeClick: () => void
  /**
   * Controls whether the revoke action and UI interactions are permitted.
   */
  enabled?: boolean
  /**
   * Indicates if this session is the active device session.
   */
  isCurrentSession?: boolean
  /**
   * Optional callback invoked when the item card is clicked.
   */
  onSessionClick?: () => void
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

function getAuthProviderIcon(authProvider: UserAuthProvider): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  switch (authProvider) {
    case UserAuthProvider.EMAIL:
      return icons.email
    case UserAuthProvider.PHONE:
      return icons.phone
    case UserAuthProvider.GOOGLE:
      return icons.google
    case UserAuthProvider.APPLE:
      return icons.apple
    default:
      return icons.email
  }
}

/**
 * List item representing an active authenticated user session.
 */
export const SessionItem = forwardRef<HTMLDivElement, SessionItemProps>(
  (
    {
      session,
      onRevokeClick,
      enabled = true,
      isCurrentSession = false,
      onSessionClick,
      strings = enUserStrings,
      className,
      ...rest
    },
    ref
  ) => {
    const isClickable = Boolean(onSessionClick)
    const IconComponent = getAuthProviderIcon(session.identifierAuthProvider)
    const formattedLastAccessed = formatEpochMillisToDateTime(session.lastAccessedAt) ?? String(session.lastAccessedAt)

    const deviceName = session.deviceInfo.deviceName ?? session.userAgent ?? strings.not_available
    const ipAddress = session.ipAddress ?? strings.not_available

    const iconClassName = cn(
      session.identifierAuthProvider === UserAuthProvider.GOOGLE ? '' : 'text-primary-foreground',
      session.identifierAuthProvider === UserAuthProvider.APPLE ? 'scale-105 -translate-y-px' : ''
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onSessionClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onSessionClick()
      }
    }

    return (
      <div
        ref={ref}
        data-testid={`SessionItem_${session.id}`}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onSessionClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full p-4 rounded-lg border transition-colors flex flex-col gap-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
          isClickable ? 'cursor-pointer hover:bg-accent/50' : '',
          isCurrentSession
            ? 'bg-primary/10 border-primary text-primary-foreground'
            : 'bg-card border-border',
          className
        )}
        {...rest}
      >
        <div className="flex items-center gap-2">
          <CoreIcon src={IconComponent} size={22} className={iconClassName} />
          <span className="text-base font-bold text-surface-foreground">
            {session.identifierDisplayName}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm text-surface-foreground">
          <span className="font-semibold">{deviceName}</span>
          {session.deviceInfo.clientType && (
            <span className="text-xs text-muted-foreground">
              {session.deviceInfo.clientType}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {strings.session_ip_address(ipAddress)}
          </span>
          <span className="text-xs text-muted-foreground">
            {strings.session_last_accessed(formattedLastAccessed)}
          </span>
        </div>

        {!isCurrentSession && (
          <div className="pt-2 border-t border-border flex justify-end">
            <button
              type="button"
              aria-label={strings.session_revoke}
              disabled={!enabled}
              onClick={(e) => {
                e.stopPropagation()
                onRevokeClick()
              }}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {strings.session_revoke}
            </button>
          </div>
        )}
      </div>
    )
  }
)

SessionItem.displayName = 'SessionItem'
