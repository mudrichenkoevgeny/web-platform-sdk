import React, { forwardRef, useEffect, useId } from 'react'
import { AccountLockoutType, UserAccountStatus, UserRole, UserModuleStrings, CommonModuleStrings, userStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
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
  UserDetailStatus,
  useUserDetailStore
} from '@/ui/screens/management/user/detail/UserDetailStore'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

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
  STORAGE_QUOTA_INPUT: 'UserDetail_StorageQuotaInput',
  STORAGE_MAX_UPLOAD_INPUT: 'UserDetail_StorageMaxUploadInput',
  STORAGE_MAX_PENDING_INPUT: 'UserDetail_StorageMaxPendingInput',
  UPDATE_BUTTON: 'UserDetail_UpdateButton',
  SAVE_ERROR_TEXT: 'UserDetail_SaveErrorText',
  DELETE_BUTTON: 'UserDetail_DeleteButton',
  DELETE_ERROR_TEXT: 'UserDetail_DeleteErrorText',
  CONFIRM_DELETE_TITLE: 'UserDetail_ConfirmDeleteTitle',
  CONFIRM_DELETE_DESC: 'UserDetail_ConfirmDeleteDesc',
  CANCEL_DELETE_BUTTON: 'UserDetail_CancelDeleteButton',
  CONFIRM_DELETE_BUTTON: 'UserDetail_ConfirmDeleteButton'
}

/**
 * Type guard validating whether a value is a valid {@link UserAccountStatus}.
 *
 * @param value - Value to test
 * @returns True if value is a valid {@link UserAccountStatus}
 */
const isUserAccountStatus = (value: unknown): value is UserAccountStatus => {
  return typeof value === 'string' && Object.values(UserAccountStatus).some((v) => v === value)
}

/**
 * Type guard validating whether a value is a valid {@link AccountLockoutType}.
 *
 * @param value - Value to test
 * @returns True if value is a valid {@link AccountLockoutType}
 */
const isAccountLockoutType = (value: unknown): value is AccountLockoutType => {
  return typeof value === 'string' && Object.values(AccountLockoutType).some((v) => v === value)
}

/**
 * Resolves localized display label for {@link UserAccountStatus}.
 *
 * @param status - User account status
 * @param strings - Common localized strings
 * @returns Localized status label
 */
const getUserAccountStatusLabel = (status: UserAccountStatus, strings: CommonModuleStrings): string => {
  switch (status) {
    case UserAccountStatus.ACTIVE:
      return strings.ui.active
    case UserAccountStatus.READ_ONLY:
      return strings.ui.readOnly
    case UserAccountStatus.BANNED:
      return strings.ui.banned
    case UserAccountStatus.SECURITY_HOLD:
      return strings.ui.securityHold
    case UserAccountStatus.PENDING_DELETION:
      return strings.ui.pendingDeletion
    default:
      return status
  }
}

/**
 * Resolves localized display label for {@link AccountLockoutType}.
 *
 * @param type - Account lockout type
 * @param strings - Common localized strings
 * @returns Localized lockout type label
 */
const getAccountLockoutTypeLabel = (type: AccountLockoutType, strings: CommonModuleStrings): string => {
  switch (type) {
    case AccountLockoutType.NONE:
      return strings.ui.lockoutNone
    case AccountLockoutType.INDEFINITE:
      return strings.ui.lockoutIndefinite
    case AccountLockoutType.TEMPORARY:
      return strings.ui.lockoutTemporary
    default:
      return type
  }
}

/**
 * Resolves localized display label for {@link UserRole}.
 *
 * @param role - User role
 * @param strings - Common localized strings
 * @returns Localized user role label
 */
const getUserRoleLabel = (role: UserRole, strings: CommonModuleStrings): string => {
  switch (role) {
    case UserRole.STAFF:
      return strings.ui.staff
    case UserRole.ADMIN:
      return strings.ui.admin
    default:
      return role
  }
}

/** Internal content component rendering user detail and management actions view. */
const UserDetailContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const screenState = useUserDetailStore((s) => s.screenState)
  const onAuthorityLevelChanged = useUserDetailStore((s) => s.onAuthorityLevelChanged)
  const onAccountStatusChanged = useUserDetailStore((s) => s.onAccountStatusChanged)
  const onLockoutTypeChanged = useUserDetailStore((s) => s.onLockoutTypeChanged)
  const onTemporaryLockoutUntilChanged = useUserDetailStore((s) => s.onTemporaryLockoutUntilChanged)
  const onStorageQuotaBytesChanged = useUserDetailStore((s) => s.onStorageQuotaBytesChanged)
  const onStorageMaxUploadSizeBytesChanged = useUserDetailStore((s) => s.onStorageMaxUploadSizeBytesChanged)
  const onStorageMaxPendingUploadsChanged = useUserDetailStore((s) => s.onStorageMaxPendingUploadsChanged)
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
  const storageQuotaId = useId()
  const storageMaxUploadId = useId()
  const storageMaxPendingId = useId()

  switch (screenState.status) {
    case UserDetailStatus.LOADING:
      return <FullscreenLoading />

    case UserDetailStatus.ERROR:
      return (
        <FullscreenError
          data-testid={UserDetailTestTags.DISABLE_TOTP_ERROR_TEXT}
          error={screenState.error}
          onRetry={onRetry}
          onBack={onBackClick}
          title={strings.ui.userDetailsTitle}
        />
      )

    case UserDetailStatus.CONTENT: {
      const {
        user,
        isSelfUser,
        authorityLevelInput,
        accountStatusInput,
        lockoutTypeInput,
        temporaryLockoutUntilInput,
        storageQuotaBytesInput,
        storageMaxUploadSizeBytesInput,
        storageMaxPendingUploadsInput,
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
      const lastLoginText = user.lastLoginAt ? (formatEpochMillisToDateTime(user.lastLoginAt) ?? String(user.lastLoginAt)) : '-'
      const lastActiveText = user.lastActiveAt ? (formatEpochMillisToDateTime(user.lastActiveAt) ?? String(user.lastActiveAt)) : '-'

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
            <p data-testid={UserDetailTestTags.USER_ROLE_TEXT} className="text-sm text-surface-foreground">{`${strings.ui.userRole}: ${getUserRoleLabel(user.role, commonStrings)}`}</p>
            <p data-testid={UserDetailTestTags.TOTP_ENABLED_TEXT} className="text-sm text-surface-foreground">{strings.ui.totpEnabledLabel(user.isTotpEnabled ? commonStrings.ui.yes : commonStrings.ui.no)}</p>

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
                  const val = e.target.value
                  if (isUserAccountStatus(val)) {
                    onAccountStatusChanged(val)
                  }
                }}
                disabled={isSelfUser || isSaving || isDeleting}
                className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.values(UserAccountStatus).map((status) => (
                  <option key={status} value={status}>
                    {getUserAccountStatusLabel(status, commonStrings)}
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
                {commonStrings.ui.lockoutType}
              </label>
              <select
                id={lockoutTypeId}
                data-testid={UserDetailTestTags.LOCKOUT_TYPE_SELECT}
                value={lockoutTypeInput}
                onChange={(e) => {
                  const val = e.target.value
                  if (isAccountLockoutType(val)) {
                    onLockoutTypeChanged(val)
                  }
                }}
                disabled={isSelfUser || isSaving || isDeleting}
                className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.values(AccountLockoutType).map((type) => (
                  <option key={type} value={type}>
                    {getAccountLockoutTypeLabel(type, commonStrings)}
                  </option>
                ))}
              </select>
            </div>

            <CoreOutlinedTextField
              id={tempLockoutId}
              data-testid={UserDetailTestTags.LOCKOUT_UNTIL_INPUT}
              value={temporaryLockoutUntilInput}
              onChange={(e) => onTemporaryLockoutUntilChanged(e.target.value)}
              label={commonStrings.ui.lockoutUntil}
              disabled={isSelfUser || isSaving || isDeleting}
            />

            <div className="pt-2 border-t border-border flex flex-col gap-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {strings.ui.customStorageConfiguration}
              </p>

              <CoreOutlinedTextField
                id={storageQuotaId}
                data-testid={UserDetailTestTags.STORAGE_QUOTA_INPUT}
                type="number"
                value={storageQuotaBytesInput}
                onChange={(e) => onStorageQuotaBytesChanged(e.target.value)}
                label={strings.ui.userStorageQuotaOptional}
                placeholder={strings.ui.defaultNullPlaceholder}
                disabled={isSelfUser || isSaving || isDeleting}
              />

              <CoreOutlinedTextField
                id={storageMaxUploadId}
                data-testid={UserDetailTestTags.STORAGE_MAX_UPLOAD_INPUT}
                type="number"
                value={storageMaxUploadSizeBytesInput}
                onChange={(e) => onStorageMaxUploadSizeBytesChanged(e.target.value)}
                label={strings.ui.userMaxUploadSizeOptional}
                placeholder={strings.ui.defaultNullPlaceholder}
                disabled={isSelfUser || isSaving || isDeleting}
              />

              <CoreOutlinedTextField
                id={storageMaxPendingId}
                data-testid={UserDetailTestTags.STORAGE_MAX_PENDING_INPUT}
                type="number"
                value={storageMaxPendingUploadsInput}
                onChange={(e) => onStorageMaxPendingUploadsChanged(e.target.value)}
                label={strings.ui.userMaxPendingUploadsOptional}
                placeholder={strings.ui.defaultNullPlaceholder}
                disabled={isSelfUser || isSaving || isDeleting}
              />
            </div>

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
  }
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
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
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
