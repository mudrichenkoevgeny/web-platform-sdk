import React, { forwardRef } from 'react'
import { UserAuthProvider, UserModuleStrings, formatLocalizedString, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon, formatEpochMillisToDateTime } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { icons } from '@/assets/icons/index'
import type { UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'

const defaultUserStrings = new UserModuleStrings()
const defaultCommonStrings = new CommonModuleStrings()

/**
 * Props for the {@link SessionItem} component.
 */
export interface SessionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * User session domain object to display.
   */
  session: UserSessionSummary
  /**
   * Optional callback invoked when the revoke button is clicked.
   */
  onRevokeClick?: () => void
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
  strings?: UserModuleStrings
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
      strings = defaultUserStrings,
      className,
      ...rest
    },
    ref
  ) => {
    const isClickable = Boolean(onSessionClick)
    const IconComponent = getAuthProviderIcon(session.identifierAuthProvider)
    const formattedLastAccessed = formatEpochMillisToDateTime(session.lastAccessedAt) ?? String(session.lastAccessedAt)

    const deviceName = session.clientDeviceInfo.deviceName ?? defaultCommonStrings.ui.notAvailable

    const iconClassName = cn(
      session.identifierAuthProvider === UserAuthProvider.GOOGLE ? '' : 'text-primary-foreground',
      session.identifierAuthProvider === UserAuthProvider.APPLE ? 'scale-105 -translate-y-px' : ''
    )

    return (
      <div
        ref={ref}
        data-testid={`SessionItem_${session.id}`}
        className={cn(
          'relative w-full p-4 rounded-lg border transition-colors flex flex-col gap-3 shadow-sm',
          isClickable ? 'hover:bg-accent/50' : '',
          isCurrentSession
            ? 'bg-primary/10 border-primary text-primary-foreground'
            : 'bg-card border-border',
          className
        )}
        {...rest}
      >
        {isClickable && (
          <button
            type="button"
            aria-label={strings.ui.sessionDetailTitleSession}
            onClick={onSessionClick}
            className="absolute inset-0 w-full h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary z-0 cursor-pointer"
          />
        )}
        <div className="flex items-center gap-2 relative z-10 pointer-events-none">
          <CoreIcon src={IconComponent} size={22} className={iconClassName} />
          <span className="text-base font-bold text-surface-foreground">
            {session.identifierDisplayName}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm text-surface-foreground relative z-10 pointer-events-none">
          <span className="font-semibold">{deviceName}</span>
          {session.clientDeviceInfo.clientType && (
            <span className="text-xs text-muted-foreground">
              {session.clientDeviceInfo.clientType}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {strings.ui.sessionLastAccessed(formattedLastAccessed)}
          </span>
        </div>

        {!isCurrentSession && onRevokeClick && (
          <div className="pt-2 border-t border-border flex justify-end relative z-10">
            <button
              type="button"
              aria-label={strings.ui.sessionRevoke}
              disabled={!enabled}
              onClick={(e) => {
                e.stopPropagation()
                onRevokeClick()
              }}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {strings.ui.sessionRevoke}
            </button>
          </div>
        )}
      </div>
    )
  }
)

SessionItem.displayName = 'SessionItem'
