import React, { forwardRef, useEffect, useId } from 'react'
import { AccountLockoutType, UserAccountStatus, UserRole } from '@mudrichenkoevgeny/shared-foundation'
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
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import {
  hasUserDetailChanges,
  UserDetailProvider,
  useUserDetailStore
} from '@/ui/screens/management/user/detail/UserDetailStore'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

const getUserAccountStatusLabel = (status: UserAccountStatus, strings: FeatureManagementUserStrings): string => {
  switch (status) {
    case UserAccountStatus.ACTIVE:
      return strings.ui_common_active
    case UserAccountStatus.READ_ONLY:
      return strings.ui_common_read_only
    case UserAccountStatus.BANNED:
      return strings.ui_common_banned
    case UserAccountStatus.SECURITY_HOLD:
      return strings.ui_common_security_hold
    case UserAccountStatus.PENDING_DELETION:
      return strings.ui_common_pending_deletion
    default:
      return status
  }
}

const getAccountLockoutTypeLabel = (type: AccountLockoutType, strings: FeatureManagementUserStrings): string => {
  switch (type) {
    case AccountLockoutType.NONE:
      return strings.ui_common_lockout_none
    case AccountLockoutType.INDEFINITE:
      return strings.ui_common_lockout_indefinite
    case AccountLockoutType.TEMPORARY:
      return strings.ui_common_lockout_temporary
    default:
      return type
  }
}

const getUserRoleLabel = (role: UserRole, strings: FeatureManagementUserStrings): string => {
  switch (role) {
    case UserRole.STAFF:
      return strings.ui_common_staff
    case UserRole.ADMIN:
      return strings.ui_common_admin
    default:
      return role
  }
}

const UserDetailContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
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
        error={screenState.error}
        onRetry={onRetry}
      />
    )
  }

  const {
    user,
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
  const lastLoginText = user.lastLoginAt ? (formatEpochMillisToDateTime(user.lastLoginAt) ?? String(user.lastLoginAt)) : strings.not_available
  const lastActiveText = user.lastActiveAt ? (formatEpochMillisToDateTime(user.lastActiveAt) ?? String(user.lastActiveAt)) : strings.not_available

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-6">
        <CoreBackButton onClick={onBackClick} />
        <CoreScreenTitleText
          text={strings.user_details_title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-4 mb-6">
        <CoreTitleText text={`${strings.user_id(user.id)}`} />
        <p className="text-sm text-surface-foreground">{`${strings.user_role}: ${getUserRoleLabel(user.role as UserRole, strings)}`}</p>
        <p className="text-sm text-surface-foreground">{strings.totp_enabled_label(user.isTotpEnabled ? strings.ui_common_yes : strings.ui_common_no)}</p>

        {user.isTotpEnabled && (
          <div className="flex flex-col gap-1">
            <CoreButton
              type="button"
              label={isDisablingTotp ? strings.disabling_totp : strings.disable_totp}
              onClick={onDisableTotpClick}
              disabled={isSaving || isDeleting || isDisablingTotp}
            />
            {disableTotpError && (
              <CoreErrorText text={errorParser.parse(disableTotpError) ?? ''} />
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground">{strings.created_at_label(createdAtText)}</p>
        <p className="text-sm text-muted-foreground">{strings.last_login_at_label(lastLoginText)}</p>
        <p className="text-sm text-muted-foreground">{strings.last_active_at_label(lastActiveText)}</p>

        {user.accountStatus === UserAccountStatus.PENDING_DELETION && user.scheduledPermanentDeletionAt && (
          <CoreErrorText
            text={strings.scheduled_deletion_at_label(
              formatEpochMillisToDateTime(user.scheduledPermanentDeletionAt) ?? String(user.scheduledPermanentDeletionAt)
            )}
          />
        )}

        <div className="flex gap-2">
          <CoreButton
            type="button"
            label={strings.user_sessions}
            onClick={onSessionsClick}
            className="flex-1"
          />
          <CoreButton
            type="button"
            label={strings.user_identifiers}
            onClick={onIdentifiersClick}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={statusSelectId} className="text-xs font-medium text-surface-foreground">
            {strings.user_account_status}
          </label>
          <select
            id={statusSelectId}
            value={accountStatusInput}
            onChange={(e) => onAccountStatusChanged(e.target.value)}
            disabled={isSaving || isDeleting}
            className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.values(UserAccountStatus).map((status) => (
              <option key={status} value={status}>
                {getUserAccountStatusLabel(status, strings)}
              </option>
            ))}
          </select>
        </div>

        <CoreOutlinedTextField
          id={authLevelId}
          value={authorityLevelInput}
          onValueChange={onAuthorityLevelChanged}
          label={strings.authority_level}
          disabled={isSaving || isDeleting}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor={lockoutTypeId} className="text-xs font-medium text-surface-foreground">
            {strings.ui_common_lockout_type}
          </label>
          <select
            id={lockoutTypeId}
            value={lockoutTypeInput}
            onChange={(e) => onLockoutTypeChanged(e.target.value)}
            disabled={isSaving || isDeleting}
            className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.values(AccountLockoutType).map((type) => (
              <option key={type} value={type}>
                {getAccountLockoutTypeLabel(type, strings)}
              </option>
            ))}
          </select>
        </div>

        <CoreOutlinedTextField
          id={tempLockoutId}
          value={temporaryLockoutUntilInput}
          onValueChange={onTemporaryLockoutUntilChanged}
          label={strings.ui_common_lockout_until}
          disabled={isSaving || isDeleting}
        />

        <div className="flex flex-col gap-2 pt-2">
          <CoreButton
            type="button"
            label={isSaving ? strings.saving : strings.update_user}
            onClick={onUpdateClick}
            disabled={!hasChanges || isSaving || isDeleting}
          />
          {saveError && (
            <CoreErrorText text={errorParser.parse(saveError) ?? ''} />
          )}

          <CoreButton
            type="button"
            label={strings.delete_user}
            onClick={onDeleteClick}
            disabled={isSaving || isDeleting}
            className="bg-error hover:bg-error/90 text-error-foreground"
          />
          {deleteError && (
            <CoreErrorText text={errorParser.parse(deleteError) ?? ''} />
          )}
        </div>
      </div>

      {isDeleteConfirmationVisible && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border p-6 rounded-lg max-w-sm w-full flex flex-col gap-4 shadow-lg">
            <CoreTitleText text={strings.delete_user} />
            <p className="text-sm text-surface-foreground">{strings.delete_user_confirmation_desc}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onDismissDeleteDialog}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-md border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors"
              >
                {strings.dialog_cancel}
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteClick}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-md bg-error text-error-foreground hover:bg-error/90 transition-colors"
              >
                {strings.dialog_confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const UserDetailController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const initScreen = useUserDetailStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <UserDetailContent strings={strings} />
}

export interface UserDetailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: UserDetailStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const UserDetailScreen = forwardRef<HTMLDivElement, UserDetailScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
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
