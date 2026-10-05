import React, { forwardRef } from 'react'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreIcon,
  CoreScreenTitleText,
  CoreTextButton,
  formatEpochMillisToDateTime,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { icons } from '@/assets/icons/index'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import {
  SessionDetailProvider,
  useSessionDetailStore
} from '@/ui/screens/profile/session/detail/session-detail-store'
import type { SessionDetailStoreDependencies } from "@/ui/screens/profile/session/detail/session-detail-store";

/**
 * Automation test tags for {@link SessionDetailScreen}.
 */
export const SessionDetailTestTags = {
  TITLE: 'SessionDetail_Title',
  BACK_BUTTON: 'SessionDetail_BackButton',
  GLOBAL_ERROR: 'SessionDetail_GlobalError',
  USER_ROW: 'SessionDetail_UserRow',
  USER_ID: 'SessionDetail_UserId',
  SESSION_CARD: 'SessionDetail_SessionCard',
  IDENTIFIER_DISPLAY_NAME: 'SessionDetail_IdentifierDisplayName',
  AUTH_PROVIDER: 'SessionDetail_AuthProvider',
  DEVICE_NAME: 'SessionDetail_DeviceName',
  CLIENT_TYPE: 'SessionDetail_ClientType',
  LANGUAGE: 'SessionDetail_Language',
  APP_VERSION: 'SessionDetail_AppVersion',
  OS_VERSION: 'SessionDetail_OsVersion',
  IP_ADDRESS: 'SessionDetail_IpAddress',
  LAST_ACCESSED_AT: 'SessionDetail_LastAccessedAt',
  CREATED_AT: 'SessionDetail_CreatedAt',
  REVOKE_BUTTON: 'SessionDetail_RevokeButton',
  ACTION_ERROR_TEXT: 'SessionDetail_ActionErrorText'
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

const SessionDetailContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useSessionDetailStore((s) => s.screenState)
  const onRevokeSessionClick = useSessionDetailStore((s) => s.onRevokeSessionClick)
  const onRetry = useSessionDetailStore((s) => s.onRetry)
  const onBackClick = useSessionDetailStore((s) => s.onBackClick)
  const onIdentifierClick = useSessionDetailStore((s) => s.onIdentifierClick)
  const onUserClick = useSessionDetailStore((s) => s.onUserClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-4">
        <CoreErrorText
          text={errorParser.parse(screenState.error) ?? ''}
          data-testid={SessionDetailTestTags.GLOBAL_ERROR}
        />
        <CoreTextButton
          type="button"
          label={strings.resend_code ? strings.resend_code : 'Retry'}
          onClick={onRetry}
        />
      </div>
    )
  }

  const { session, isCurrentSession, actionLoading, actionError } = screenState
  const notAvailableText = strings.not_available
  const IconComponent = getAuthProviderIcon(session.identifierAuthProvider)

  const titleText = isCurrentSession
    ? strings.session_detail_title_current_session
    : strings.session_detail_title_session

  const deviceName = session.deviceInfo.deviceName ?? session.userAgent ?? notAvailableText
  const clientType = session.deviceInfo.clientType ?? notAvailableText
  const language = session.deviceInfo.language ?? notAvailableText
  const appVersion = session.deviceInfo.appVersion ?? notAvailableText
  const osVersion = session.deviceInfo.operationSystemVersion ?? notAvailableText
  const ipAddress = session.ipAddress ?? notAvailableText

  const lastAccessedFormatted = formatEpochMillisToDateTime(session.lastAccessedAt) ?? String(session.lastAccessedAt)
  const createdAtFormatted = formatEpochMillisToDateTime(session.createdAt) ?? String(session.createdAt)

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton
          onClick={onBackClick}
          data-testid={SessionDetailTestTags.BACK_BUTTON}
        />
        <CoreScreenTitleText
          text={titleText}
          className="absolute left-1/2 -translate-x-1/2"
          data-testid={SessionDetailTestTags.TITLE}
        />
        <div className="w-10" />
      </div>

      <div
        className="w-full flex-1 flex flex-col gap-4 my-auto max-w-md mx-auto"
        data-testid={SessionDetailTestTags.SESSION_CARD}
      >
        <div
          onClick={onUserClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onUserClick()
            }
          }}
          className="p-4 bg-card text-card-foreground border border-border rounded-xl shadow-sm cursor-pointer hover:bg-accent/40 transition-colors flex flex-col gap-1"
          data-testid={SessionDetailTestTags.USER_ROW}
        >
          <span className="text-xs text-muted-foreground font-medium">
            {strings.user_label}
          </span>
          <span
            className="text-sm font-bold text-surface-foreground"
            data-testid={SessionDetailTestTags.USER_ID}
          >
            {strings.user_id(session.userId)}
          </span>
        </div>

        <div
          onClick={onIdentifierClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onIdentifierClick()
            }
          }}
          className="p-4 bg-card text-card-foreground border border-border rounded-xl shadow-sm cursor-pointer hover:bg-accent/40 transition-colors flex items-center gap-3"
        >
          <CoreIcon src={IconComponent} size={24} />
          <div className="flex flex-col">
            <span
              className="text-sm font-bold text-surface-foreground"
              data-testid={SessionDetailTestTags.IDENTIFIER_DISPLAY_NAME}
            >
              {session.identifierDisplayName}
            </span>
            <span
              className="text-xs text-muted-foreground"
              data-testid={SessionDetailTestTags.AUTH_PROVIDER}
            >
              {strings.session_detail_auth_provider}: {session.identifierAuthProvider}
            </span>
          </div>
        </div>

        <div className="p-4 bg-card text-card-foreground border border-border rounded-xl shadow-sm flex flex-col gap-2 text-xs">
          <span className="text-sm font-bold text-surface-foreground mb-1">
            {strings.session_detail_device_info}
          </span>

          <span data-testid={SessionDetailTestTags.DEVICE_NAME}>
            <strong className="text-muted-foreground">{strings.session_detail_device_name}:</strong> {deviceName}
          </span>

          <span data-testid={SessionDetailTestTags.CLIENT_TYPE}>
            <strong className="text-muted-foreground">{strings.session_detail_client_type}:</strong> {clientType}
          </span>

          <span data-testid={SessionDetailTestTags.LANGUAGE}>
            <strong className="text-muted-foreground">{strings.session_detail_language}:</strong> {language}
          </span>

          <span data-testid={SessionDetailTestTags.APP_VERSION}>
            <strong className="text-muted-foreground">{strings.session_detail_app_version}:</strong> {appVersion}
          </span>

          <span data-testid={SessionDetailTestTags.OS_VERSION}>
            <strong className="text-muted-foreground">{strings.session_detail_os_version}:</strong> {osVersion}
          </span>

          <div className="border-t border-border my-1 pt-2 flex flex-col gap-1">
            <span data-testid={SessionDetailTestTags.IP_ADDRESS}>
              <strong className="text-muted-foreground">{strings.session_detail_ip_address_label}:</strong> {ipAddress}
            </span>

            <span data-testid={SessionDetailTestTags.LAST_ACCESSED_AT}>
              <strong className="text-muted-foreground">{strings.session_detail_last_accessed_label}:</strong> {lastAccessedFormatted}
            </span>

            <span data-testid={SessionDetailTestTags.CREATED_AT}>
              <strong className="text-muted-foreground">{strings.session_detail_created_at_label}:</strong> {createdAtFormatted}
            </span>
          </div>
        </div>

        {!isCurrentSession && (
          <div className="w-full pt-2 flex flex-col gap-2">
            <CoreButton
              type="button"
              label={strings.session_revoke}
              onClick={onRevokeSessionClick}
              disabled={actionLoading}
              className="bg-error hover:bg-error/90 text-error-foreground"
              data-testid={SessionDetailTestTags.REVOKE_BUTTON}
            />

            {actionError && (
              <CoreErrorText
                text={errorParser.parse(actionError) ?? ''}
                data-testid={SessionDetailTestTags.ACTION_ERROR_TEXT}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Props for {@link SessionDetailScreen}.
 */
export interface SessionDetailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: SessionDetailStoreDependencies
  strings?: FeatureUserStrings
}

/**
 * Screen component displaying detailed information about a single active user session.
 */
export const SessionDetailScreen = forwardRef<HTMLDivElement, SessionDetailScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <SessionDetailProvider dependencies={dependencies}>
          <SessionDetailContent strings={strings} />
        </SessionDetailProvider>
      </div>
    )
  }
)

SessionDetailScreen.displayName = 'SessionDetailScreen'
