import React, { forwardRef, useEffect, useId } from 'react'
import { z } from 'zod'
import { AccountLockoutType, UserAccountStatus, UserRole, UserModuleStrings, CommonModuleStrings, formatLocalizedString } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreOutlinedTextField,
  CoreScreenTitleText,
  CoreTitleText,
  formatEpochMillisToDateTime,
  FullscreenError,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  hasUserDetailChanges,
  UserDetailProvider,
  useUserDetailStore
} from '@/ui/screens/management/user/detail/UserDetailStore'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

const defaultUserStrings = new UserModuleStrings()
const defaultCommonStrings = new CommonModuleStrings()

/** Automation test tags for {@link UserDetailScreen}. */
export const UserDetailTestTags = {
  BACK_BUTTON: 'UserDetail_BackButton',
  TITLE: 'UserDetail_Title',
  USER_ID_TEXT: 'UserDetail_UserIdText',
  USER_ROLE_TEXT: 'UserDetail_UserRoleText',
  TOTP_ENABLED_TEXT: 'UserDetail_TotpEnabledText',
  DISABLE_TOTP_BUTTON: 'UserDetail_DisableTotpButton',
  DISABLE_TOTP_ERROR_TEXT: 'UserDetail_DisableTotpErrorText',
  SESSIONS_BUTTON: 'UserDetail_SessionsButton',
  IDENTIFIERS_BUTTON: 'UserDetail_IdentifiersButton',
  AUDIT_EVENTS_BUTTON: 'UserDetail_AuditEventsButton',
  ACCOUNT_STATUS_SELECT: 'UserDetail_AccountStatusSelect',
  AUTHORITY_LEVEL_INPUT: 'UserDetail_AuthorityLevelInput',
  LOCKOUT_TYPE_SELECT: 'UserDetail_LockoutTypeSelect',
  LOCKOUT_UNTIL_INPUT: 'UserDetail_LockoutUntilInput',
  UPDATE_BUTTON: 'UserDetail_UpdateButton',
  SAVE_ERROR_TEXT: 'UserDetail_SaveErrorText',
  DELETE_BUTTON: 'UserDetail_DeleteButton',
  DELETE_ERROR_TEXT: 'UserDetail_DeleteErrorText',
  CONFIRM_DELETE_TITLE: 'UserDetail_ConfirmDeleteTitle',
  CONFIRM_DELETE_DESC: 'UserDetail_ConfirmDeleteDesc',
  CANCEL_DELETE_BUTTON: 'UserDetail_CancelDeleteButton',
  CONFIRM_DELETE_BUTTON: 'UserDetail_ConfirmDeleteButton'
}

const parseUserAccountStatus = (value: unknown): UserAccountStatus | null => {
  const parseResult = z.nativeEnum(UserAccountStatus).safeParse(value)
  return parseResult.success ? parseResult.data : null
}

const parseAccountLockoutType = (value: unknown): AccountLockoutType | null => {
  const parseResult = z.nativeEnum(AccountLockoutType).safeParse(value)
  return parseResult.success ? parseResult.data : null
}

const getUserAccountStatusLabel = (status: UserAccountStatus, commonStrings: CommonModuleStrings): string => {
  switch (status) {
    case UserAccountStatus.ACTIVE:
      return commonStrings.ui.active
    case UserAccountStatus.READ_ONLY:
      return commonStrings.ui.readOnly
    case UserAccountStatus.BANNED:
      return commonStrings.ui.banned
    case UserAccountStatus.SECURITY_HOLD:
      return commonStrings.ui.securityHold
    case UserAccountStatus.PENDING_DELETION:
      return commonStrings.ui.pendingDeletion
    default:
      return status
  }
}

const getAccountLockoutTypeLabel = (type: AccountLockoutType, commonStrings: CommonModuleStrings): string => {
  switch (type) {
    case AccountLockoutType.NONE:
      return commonStrings.ui.lockoutNone
    case AccountLockoutType.INDEFINITE:
      return commonStrings.ui.lockoutIndefinite
    case AccountLockoutType.TEMPORARY:
      return commonStrings.ui.lockoutTemporary
    default:
      return type
  }
}

const getUserRoleLabel = (role: UserRole, commonStrings: CommonModuleStrings): string => {
  switch (role) {
    case UserRole.STAFF:
      return commonStrings.ui.staff
    case UserRole.ADMIN:
      return commonStrings.ui.admin
    default:
      return role
  }
}

const UserDetailContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = defaultUserStrings
}) => {
  const screenState = useUserDetailStore((s) => s.screenState)
  const onAuthorityLevelChanged = useUserDetailStore((s) => s.onAuthorityLevelChanged)
  const onAccountStatusChanged = useUserDetailStore((s) => s.onAccountStatusChanged)
  const onLockoutTypeChanged = useUserDetailStore((s) => s.onLockoutTypeChanged)
  const onTemporaryLockoutUntilChanged = useUserDetailStore((s) => s.onTemporaryLockoutUntilChanged)
  const onUpdateClick = useUserDetailStore((s) => s.onUpdateClick)
  const onDeleteClick = useUserDetailStore((s) => s.onDeleteClick)
  const onConfirmDeleteClick = useUserDetailStore((s) => s.onConfirmDeleteClick)
  const onDismissDeleteDialog = useUserDetailStore((s) => s.onDismissDeleteDialog)
  const onDisableTotpClick = useUserDetailStore((s) => s.onDisableTotpClick)
  const onSessionsClick = useUserDetailStore((s) => s.onSessionsClick)
  const onIdentifiersClick = useUserDetailStore((s) => s.onIdentifiersClick)
  const onAuditEventsClick = useUserDetailStore((s) => s.onAuditEventsClick)
  const onRetry = useUserDetailStore((s) => s.onRetry)
  const onBackClick = useUserDetailStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const statusSelectId = useId()
  const authLevelId = useId()
  const lockoutTypeId = useId()
  const tempLockoutId = useId()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        data-testid={UserDetailTestTags.DISABLE_TOTP_ERROR_TEXT}
        error={screenState.error}
        onRetry={onRetry}
        onBack={onBackClick}
        title={strings.ui.userDetailsTitle}
      />
    )
  }

  const {
    user,
    isSelfUser,
    authorityLevelInput,
    accountStatusInput,
    lockoutTypeInput,
    temporaryLockoutUntilInput,
    isSaving,
    saveError,
    isDeleting,
    deleteError,
    isDisablingTotp,
    disableTotpError,
    isDeleteConfirmationVisible
  } = screenState

  const hasChanges = hasUserDetailChanges(screenState)

  const createdAtText = formatEpochMillisToDateTime(user.createdAt) ?? String(user.createdAt)
  const lastLoginText = user.lastLoginAt ? (formatEpochMillisToDateTime(user.lastLoginAt) ?? String(user.lastLoginAt)) : defaultCommonStrings.ui.notAvailable
  const lastActiveText = user.lastActiveAt ? (formatEpochMillisToDateTime(user.lastActiveAt) ?? String(user.lastActiveAt)) : defaultCommonStrings.ui.notAvailable

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-6">
        <CoreBackButton data-testid={UserDetailTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={UserDetailTestTags.TITLE}
          text={strings.ui.userDetailsTitle}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-4 mb-6">
        <CoreTitleText data-testid={UserDetailTestTags.USER_ID_TEXT} text={`${user.id ?? ''}`} />
        <p data-testid={UserDetailTestTags.USER_ROLE_TEXT} className="text-sm text-surface-foreground">{`${strings.ui.userRole}: ${getUserRoleLabel(user.role, defaultCommonStrings)}`}</p>
        <p data-testid={UserDetailTestTags.TOTP_ENABLED_TEXT} className="text-sm text-surface-foreground">{strings.ui.totpEnabledLabel(user.isTotpEnabled ? defaultCommonStrings.ui.yes : defaultCommonStrings.ui.no)}</p>

        {user.isTotpEnabled && (
          <div className="flex flex-col gap-1">
            <CoreButton
              type="button"
              data-testid={UserDetailTestTags.DISABLE_TOTP_BUTTON}
              label={isDisablingTotp ? strings.ui.disablingTotp : strings.ui.disableTotp}
              onClick={onDisableTotpClick}
              disabled={isSelfUser || isSaving || isDeleting || isDisablingTotp}
            />
            {disableTotpError && (
              <CoreErrorText data-testid={UserDetailTestTags.DISABLE_TOTP_ERROR_TEXT} text={errorParser.parse(disableTotpError) ?? ''} />
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground">{strings.ui.createdAtLabel(createdAtText)}</p>
        <p className="text-sm text-muted-foreground">{strings.ui.lastLoginAtLabel(lastLoginText)}</p>
        <p className="text-sm text-muted-foreground">{strings.ui.lastActiveAtLabel(lastActiveText)}</p>

        {user.accountStatus === UserAccountStatus.PENDING_DELETION && user.scheduledPermanentDeletionAt && (
          <CoreErrorText
            text={strings.ui.scheduledDeletionAtLabel(
              formatEpochMillisToDateTime(user.scheduledPermanentDeletionAt) ?? String(user.scheduledPermanentDeletionAt)
            )}
          />
        )}

        <div className="flex gap-2">
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.SESSIONS_BUTTON}
            label={strings.ui.userSessions}
            onClick={onSessionsClick}
            className="flex-1"
          />
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.IDENTIFIERS_BUTTON}
            label={strings.ui.userIdentifiers}
            onClick={onIdentifiersClick}
            className="flex-1"
          />
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.AUDIT_EVENTS_BUTTON}
            label={strings.ui.auditLogsTitle}
            onClick={onAuditEventsClick}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={statusSelectId} className="text-xs font-medium text-surface-foreground">
            {strings.ui.userAccountStatus}
          </label>
          <select
            id={statusSelectId}
            data-testid={UserDetailTestTags.ACCOUNT_STATUS_SELECT}
            value={accountStatusInput}
            onChange={(e) => {
              const status = parseUserAccountStatus(e.target.value)
              if (status) {
                onAccountStatusChanged(status)
              }
            }}
            disabled={isSelfUser || isSaving || isDeleting}
            className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.values(UserAccountStatus).map((status) => (
              <option key={status} value={status}>
                {getUserAccountStatusLabel(status, defaultCommonStrings)}
              </option>
            ))}
          </select>
        </div>

        <CoreOutlinedTextField
          id={authLevelId}
          data-testid={UserDetailTestTags.AUTHORITY_LEVEL_INPUT}
          value={authorityLevelInput}
          onChange={(e) => onAuthorityLevelChanged(e.target.value)}
          label={strings.ui.authorityLevel}
          disabled={isSelfUser || isSaving || isDeleting}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor={lockoutTypeId} className="text-xs font-medium text-surface-foreground">
            {defaultCommonStrings.ui.lockoutType}
          </label>
          <select
            id={lockoutTypeId}
            data-testid={UserDetailTestTags.LOCKOUT_TYPE_SELECT}
            value={lockoutTypeInput}
            onChange={(e) => {
              const lockoutType = parseAccountLockoutType(e.target.value)
              if (lockoutType) {
                onLockoutTypeChanged(lockoutType)
              }
            }}
            disabled={isSelfUser || isSaving || isDeleting}
            className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.values(AccountLockoutType).map((type) => (
              <option key={type} value={type}>
                {getAccountLockoutTypeLabel(type, defaultCommonStrings)}
              </option>
            ))}
          </select>
        </div>

        <CoreOutlinedTextField
          id={tempLockoutId}
          data-testid={UserDetailTestTags.LOCKOUT_UNTIL_INPUT}
          value={temporaryLockoutUntilInput}
          onChange={(e) => onTemporaryLockoutUntilChanged(e.target.value)}
          label={defaultCommonStrings.ui.lockoutUntil}
          disabled={isSelfUser || isSaving || isDeleting}
        />

        <div className="flex flex-col gap-2 pt-2">
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.UPDATE_BUTTON}
            label={isSaving ? strings.ui.saving : strings.ui.updateUser}
            onClick={onUpdateClick}
            disabled={isSelfUser || !hasChanges || isSaving || isDeleting}
          />
          {saveError && (
            <CoreErrorText data-testid={UserDetailTestTags.SAVE_ERROR_TEXT} text={errorParser.parse(saveError) ?? ''} />
          )}

          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.DELETE_BUTTON}
            label={strings.ui.deleteUser}
            onClick={onDeleteClick}
            disabled={isSelfUser || isSaving || isDeleting}
            className="bg-error hover:bg-error/90 text-error-foreground"
          />
          {deleteError && (
            <CoreErrorText data-testid={UserDetailTestTags.DELETE_ERROR_TEXT} text={errorParser.parse(deleteError) ?? ''} />
          )}
        </div>
      </div>

      {isDeleteConfirmationVisible && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg max-w-sm w-full flex flex-col gap-4">
            <CoreTitleText data-testid={UserDetailTestTags.CONFIRM_DELETE_TITLE} text={strings.ui.deleteUser} />
            <p data-testid={UserDetailTestTags.CONFIRM_DELETE_DESC} className="text-sm text-surface-foreground">{strings.ui.deleteUserConfirmationDesc}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                data-testid={UserDetailTestTags.CANCEL_DELETE_BUTTON}
                onClick={onDismissDeleteDialog}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-md border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {strings.ui.dialogCancel}
              </button>
              <button
                type="button"
                data-testid={UserDetailTestTags.CONFIRM_DELETE_BUTTON}
                onClick={onConfirmDeleteClick}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-md bg-error text-error-foreground hover:bg-error/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {strings.ui.dialogConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const UserDetailController: React.FC<{ strings?: UserModuleStrings }> = ({
  strings
}) => {
  const initScreen = useUserDetailStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <UserDetailContent strings={strings} />
}

/** Props for {@link UserDetailScreen}. */
export interface UserDetailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies required by store. */
  dependencies: UserDetailStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/** Administrative screen component displaying detailed information and management actions for a single user account. */
export const UserDetailScreen = forwardRef<HTMLDivElement, UserDetailScreenProps>(
  ({ dependencies, strings = defaultUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <UserDetailProvider dependencies={dependencies}>
          <UserDetailController strings={strings} />
        </UserDetailProvider>
      </div>
    )
  }
)

UserDetailScreen.displayName = 'UserDetailScreen'
