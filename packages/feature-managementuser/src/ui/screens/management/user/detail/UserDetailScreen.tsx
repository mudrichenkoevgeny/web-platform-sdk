import React, { forwardRef, useEffect, useId, useRef } from 'react'
import { AccountLockoutType, UserAccountStatus, UserRole, UserModuleStrings, CommonModuleStrings, userStrings, commonStrings, storageStrings, StorageCategory } from '@mudrichenkoevgeny/shared-foundation'
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
  SelectedFilePayload,
  UserDetailProvider,
  UserDetailStatus,
  useUserDetailStore
} from '@/ui/screens/management/user/detail/UserDetailStore'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'
import { StorageFileImagePreview } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'

/** Automation test tags for {@link UserDetailScreen}. */
export const UserDetailTestTags = {
  /** Test tag for back button. */
  BACK_BUTTON: 'UserDetail_BackButton',
  /** Test tag for screen title. */
  TITLE: 'UserDetail_Title',
  /** Test tag for user ID text. */
  USER_ID_TEXT: 'UserDetail_UserIdText',
  /** Test tag for user role text. */
  USER_ROLE_TEXT: 'UserDetail_UserRoleText',
  /** Test tag for TOTP enabled text. */
  TOTP_ENABLED_TEXT: 'UserDetail_TotpEnabledText',
  /** Test tag for disable TOTP button. */
  DISABLE_TOTP_BUTTON: 'UserDetail_DisableTotpButton',
  /** Test tag for disable TOTP error text. */
  DISABLE_TOTP_ERROR_TEXT: 'UserDetail_DisableTotpErrorText',
  /** Test tag for sessions button. */
  SESSIONS_BUTTON: 'UserDetail_SessionsButton',
  /** Test tag for identifiers button. */
  IDENTIFIERS_BUTTON: 'UserDetail_IdentifiersButton',
  /** Test tag for storage files button. */
  STORAGE_FILES_BUTTON: 'UserDetail_StorageFilesButton',
  /** Test tag for audit events button. */
  AUDIT_EVENTS_BUTTON: 'UserDetail_AuditEventsButton',
  /** Test tag for avatar image preview. */
  AVATAR_IMAGE: 'UserDetail_AvatarImage',
  /** Test tag for avatar change button. */
  AVATAR_CHANGE_BUTTON: 'UserDetail_AvatarChangeButton',
  /** Test tag for remove avatar button. */
  REMOVE_AVATAR_BUTTON: 'UserDetail_RemoveAvatarButton',
  /** Test tag for account status select element. */
  ACCOUNT_STATUS_SELECT: 'UserDetail_AccountStatusSelect',
  /** Test tag for authority level input field. */
  AUTHORITY_LEVEL_INPUT: 'UserDetail_AuthorityLevelInput',
  /** Test tag for lockout type select element. */
  LOCKOUT_TYPE_SELECT: 'UserDetail_LockoutTypeSelect',
  /** Test tag for lockout until input field. */
  LOCKOUT_UNTIL_INPUT: 'UserDetail_LockoutUntilInput',
  /** Test tag for nickname input field. */
  NICKNAME_INPUT: 'UserDetail_NicknameInput',
  /** Test tag for display name input field. */
  DISPLAY_NAME_INPUT: 'UserDetail_DisplayNameInput',
  /** Test tag for birthdate input field. */
  BIRTHDATE_INPUT: 'UserDetail_BirthdateInput',
  /** Test tag for storage quota bytes input field. */
  STORAGE_QUOTA_INPUT: 'UserDetail_StorageQuotaInput',
  /** Test tag for storage max upload size bytes input field. */
  STORAGE_MAX_UPLOAD_INPUT: 'UserDetail_StorageMaxUploadInput',
  /** Test tag for storage max pending uploads input field. */
  STORAGE_MAX_PENDING_INPUT: 'UserDetail_StorageMaxPendingInput',
  /** Test tag for update button. */
  UPDATE_BUTTON: 'UserDetail_UpdateButton',
  /** Test tag for save error text. */
  SAVE_ERROR_TEXT: 'UserDetail_SaveErrorText',
  /** Test tag for delete button. */
  DELETE_BUTTON: 'UserDetail_DeleteButton',
  /** Test tag for delete error text. */
  DELETE_ERROR_TEXT: 'UserDetail_DeleteErrorText',
  /** Test tag for confirm delete modal title. */
  CONFIRM_DELETE_TITLE: 'UserDetail_ConfirmDeleteTitle',
  /** Test tag for confirm delete description. */
  CONFIRM_DELETE_DESC: 'UserDetail_ConfirmDeleteDesc',
  /** Test tag for cancel delete button. */
  CANCEL_DELETE_BUTTON: 'UserDetail_CancelDeleteButton',
  /** Test tag for confirm delete button. */
  CONFIRM_DELETE_BUTTON: 'UserDetail_ConfirmDeleteButton',
  /** Test tag for global error container. */
  GLOBAL_ERROR: 'UserDetail_GlobalError'
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
    case UserRole.USER:
      return strings.ui.user ?? 'User'
    case UserRole.STAFF:
      return strings.ui.staff
    case UserRole.ADMIN:
      return strings.ui.admin
  }
}

/** Internal content component rendering user detail and management actions view. */
const UserDetailContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const screenState = useUserDetailStore((s) => s.screenState)
  const onAuthorityLevelChanged = useUserDetailStore((s) => s.onAuthorityLevelChanged)
  const onNicknameChanged = useUserDetailStore((s) => s.onNicknameChanged)
  const onDisplayNameChanged = useUserDetailStore((s) => s.onDisplayNameChanged)
  const onBirthdateChanged = useUserDetailStore((s) => s.onBirthdateChanged)
  const onAvatarFileSelected = useUserDetailStore((s) => s.onAvatarFileSelected)
  const onRemoveAvatarClick = useUserDetailStore((s) => s.onRemoveAvatarClick)
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
  const onStorageFilesClick = useUserDetailStore((s) => s.onStorageFilesClick)
  const onAuditEventsClick = useUserDetailStore((s) => s.onAuditEventsClick)
  const errorParser = useAppErrorParser()

  const accountStatusId = useId()
  const lockoutTypeId = useId()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previousAvatarUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (previousAvatarUrlRef.current && previousAvatarUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previousAvatarUrlRef.current)
      }
    }
  }, [])

  if (screenState.status !== UserDetailStatus.CONTENT) {
    return null
  }

  const {
    user,
    isSelfUser,
    authorityLevelInput,
    accountStatusInput,
    lockoutTypeInput,
    temporaryLockoutUntilInput,
    nicknameInput,
    displayNameInput,
    birthdateInput,
    avatarUrl,
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
  const commonUi = commonStrings.ui
  const storageUi = storageStrings.ui
  const notAvailableText = commonUi.denied
  const createdAtText = formatEpochMillisToDateTime(user.createdAt) ?? String(user.createdAt)
  const lastLoginText = user.lastLoginAt ? (formatEpochMillisToDateTime(user.lastLoginAt) ?? String(user.lastLoginAt)) : notAvailableText
  const lastActiveText = user.lastActiveAt ? (formatEpochMillisToDateTime(user.lastActiveAt) ?? String(user.lastActiveAt)) : notAvailableText

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (previousAvatarUrlRef.current && previousAvatarUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previousAvatarUrlRef.current)
      }
      const localUri = URL.createObjectURL(file)
      previousAvatarUrlRef.current = localUri

      const payload: SelectedFilePayload = {
        file,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type || 'application/octet-stream',
        localUri
      }
      onAvatarFileSelected(payload)
    }
  }

  const handleRemoveAvatar = () => {
    if (previousAvatarUrlRef.current && previousAvatarUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(previousAvatarUrlRef.current)
      previousAvatarUrlRef.current = null
    }
    onRemoveAvatarClick()
  }

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full max-w-md mx-auto flex flex-col gap-4 mb-6">
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-accent flex items-center justify-center relative">
            {avatarUrl ? (
              <img
                data-testid={UserDetailTestTags.AVATAR_IMAGE}
                src={avatarUrl}
                alt={strings.ui.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-muted-foreground font-bold">
                {(displayNameInput || nicknameInput || strings.ui.user || strings.ui.editProfileTitle).charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex gap-2">
            <CoreButton
              type="button"
              data-testid={UserDetailTestTags.AVATAR_CHANGE_BUTTON}
              label={`${strings.ui.editProfileTitle} (${strings.ui.avatar})`}
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving || isDeleting}
            />
            {avatarUrl && (
              <CoreButton
                type="button"
                data-testid={UserDetailTestTags.REMOVE_AVATAR_BUTTON}
                label={strings.ui.removeAvatar}
                onClick={handleRemoveAvatar}
                disabled={isSaving || isDeleting}
              />
            )}
          </div>
        </div>

        <CoreTitleText
          data-testid={UserDetailTestTags.USER_ID_TEXT}
          text={`${commonUi.userId}: ${user.id}`}
        />
        <CoreTitleText
          data-testid={UserDetailTestTags.USER_ROLE_TEXT}
          text={`${strings.ui.userRole}: ${getUserRoleLabel(user.role, commonStrings)}`}
        />
        <CoreTitleText
          data-testid={UserDetailTestTags.TOTP_ENABLED_TEXT}
          text={strings.ui.totpEnabledLabel(String(user.isTotpEnabled))}
        />

        {user.isTotpEnabled && (
          <div className="flex flex-col gap-2">
            <CoreButton
              type="button"
              data-testid={UserDetailTestTags.DISABLE_TOTP_BUTTON}
              label={isDisablingTotp ? strings.ui.disablingTotp : strings.ui.disableTotp}
              onClick={() => void onDisableTotpClick()}
              disabled={isSaving || isDeleting || isDisablingTotp || isSelfUser}
            />
            {disableTotpError && (
              <CoreErrorText
                data-testid={UserDetailTestTags.DISABLE_TOTP_ERROR_TEXT}
                text={errorParser.parse(disableTotpError) ?? ''}
              />
            )}
          </div>
        )}

        <CoreTitleText text={strings.ui.createdAtLabel(createdAtText)} />
        <CoreTitleText text={strings.ui.lastLoginAtLabel(lastLoginText)} />
        <CoreTitleText text={strings.ui.lastActiveAtLabel(lastActiveText)} />

        <div className="flex gap-2">
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.SESSIONS_BUTTON}
            label={strings.ui.userSessions}
            onClick={onSessionsClick}
          />
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.IDENTIFIERS_BUTTON}
            label={strings.ui.userIdentifiers}
            onClick={onIdentifiersClick}
          />
        </div>

        <div className="flex gap-2">
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.STORAGE_FILES_BUTTON}
            label={storageUi.storageFileListTitle}
            onClick={onStorageFilesClick}
          />
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.AUDIT_EVENTS_BUTTON}
            label={strings.ui.userDetailAuditEvents}
            onClick={onAuditEventsClick}
          />
        </div>

        <CoreOutlinedTextField
          data-testid={UserDetailTestTags.DISPLAY_NAME_INPUT}
          value={displayNameInput}
          onChange={(e) => onDisplayNameChanged(e.target.value)}
          label={strings.ui.user}
          disabled={isSaving || isDeleting}
        />

        <CoreOutlinedTextField
          data-testid={UserDetailTestTags.NICKNAME_INPUT}
          value={nicknameInput}
          onChange={(e) => onNicknameChanged(e.target.value)}
          label={strings.ui.userLabel}
          disabled={isSaving || isDeleting}
        />

        <CoreOutlinedTextField
          data-testid={UserDetailTestTags.BIRTHDATE_INPUT}
          type="number"
          value={birthdateInput}
          onChange={(e) => onBirthdateChanged(e.target.value)}
          label={strings.ui.birthdate}
          disabled={isSaving || isDeleting}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor={accountStatusId} className="text-sm font-medium">
            {strings.ui.userAccountStatus}
          </label>
          <select
            id={accountStatusId}
            data-testid={UserDetailTestTags.ACCOUNT_STATUS_SELECT}
            value={accountStatusInput}
            onChange={(e) => {
              if (isUserAccountStatus(e.target.value)) {
                onAccountStatusChanged(e.target.value)
              }
            }}
            disabled={isSaving || isDeleting || isSelfUser}
            className="w-full p-2 border border-border rounded bg-background text-foreground"
          >
            {Object.values(UserAccountStatus).map((status) => (
              <option key={status} value={status}>
                {getUserAccountStatusLabel(status, commonStrings)}
              </option>
            ))}
          </select>
        </div>

        <CoreOutlinedTextField
          data-testid={UserDetailTestTags.AUTHORITY_LEVEL_INPUT}
          type="number"
          value={authorityLevelInput}
          onChange={(e) => onAuthorityLevelChanged(e.target.value)}
          label={strings.ui.authorityLevel}
          disabled={isSaving || isDeleting || isSelfUser}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor={lockoutTypeId} className="text-sm font-medium">
            {commonUi.lockoutType}
          </label>
          <select
            id={lockoutTypeId}
            data-testid={UserDetailTestTags.LOCKOUT_TYPE_SELECT}
            value={lockoutTypeInput}
            onChange={(e) => {
              if (isAccountLockoutType(e.target.value)) {
                onLockoutTypeChanged(e.target.value)
              }
            }}
            disabled={isSaving || isDeleting || isSelfUser}
            className="w-full p-2 border border-border rounded bg-background text-foreground"
          >
            {Object.values(AccountLockoutType).map((type) => (
              <option key={type} value={type}>
                {getAccountLockoutTypeLabel(type, commonStrings)}
              </option>
            ))}
          </select>
        </div>

        <CoreOutlinedTextField
          data-testid={UserDetailTestTags.LOCKOUT_UNTIL_INPUT}
          type="number"
          value={temporaryLockoutUntilInput}
          onChange={(e) => onTemporaryLockoutUntilChanged(e.target.value)}
          label={commonUi.lockoutUntil}
          disabled={isSaving || isDeleting || isSelfUser}
        />

        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <CoreTitleText text={strings.ui.customStorageConfiguration} className="text-base" />

          <CoreOutlinedTextField
            data-testid={UserDetailTestTags.STORAGE_QUOTA_INPUT}
            type="number"
            value={storageQuotaBytesInput}
            onChange={(e) => onStorageQuotaBytesChanged(e.target.value)}
            label={storageUi.storageQuotaBytes}
            disabled={isSaving || isDeleting || isSelfUser}
          />

          <CoreOutlinedTextField
            data-testid={UserDetailTestTags.STORAGE_MAX_UPLOAD_INPUT}
            type="number"
            value={storageMaxUploadSizeBytesInput}
            onChange={(e) => onStorageMaxUploadSizeBytesChanged(e.target.value)}
            label={storageUi.storageMaxUploadSizeBytes}
            disabled={isSaving || isDeleting || isSelfUser}
          />

          <CoreOutlinedTextField
            data-testid={UserDetailTestTags.STORAGE_MAX_PENDING_INPUT}
            type="number"
            value={storageMaxPendingUploadsInput}
            onChange={(e) => onStorageMaxPendingUploadsChanged(e.target.value)}
            label={storageUi.storageMaxPendingUploads}
            disabled={isSaving || isDeleting || isSelfUser}
          />
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.UPDATE_BUTTON}
            label={isSaving ? strings.ui.saving : strings.ui.updateUser}
            onClick={() => void onUpdateClick()}
            disabled={!hasChanges || isSaving || isDeleting || isSelfUser}
          />

          {saveError && (
            <CoreErrorText
              data-testid={UserDetailTestTags.SAVE_ERROR_TEXT}
              text={errorParser.parse(saveError) ?? ''}
            />
          )}

          <CoreButton
            type="button"
            data-testid={UserDetailTestTags.DELETE_BUTTON}
            label={isDeleting ? strings.ui.saving : strings.ui.deleteUser}
            onClick={onDeleteClick}
            disabled={isSaving || isDeleting || isSelfUser}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          />

          {deleteError && (
            <CoreErrorText
              data-testid={UserDetailTestTags.DELETE_ERROR_TEXT}
              text={errorParser.parse(deleteError) ?? ''}
            />
          )}
        </div>
      </div>

      {isDeleteConfirmationVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full flex flex-col gap-4 shadow-lg">
            <CoreTitleText data-testid={UserDetailTestTags.CONFIRM_DELETE_TITLE} text={strings.ui.dialogConfirmTitle} />
            <CoreErrorText data-testid={UserDetailTestTags.CONFIRM_DELETE_DESC} text={strings.ui.deleteUser} />
            <div className="flex justify-end gap-2">
              <CoreButton
                type="button"
                data-testid={UserDetailTestTags.CANCEL_DELETE_BUTTON}
                label={strings.ui.dialogCancel}
                onClick={onDismissDeleteDialog}
              />
              <CoreButton
                type="button"
                data-testid={UserDetailTestTags.CONFIRM_DELETE_BUTTON}
                label={strings.ui.dialogConfirm}
                onClick={() => void onConfirmDeleteClick()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Props for {@link UserDetailScreen}. */
export interface UserDetailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Injected store dependencies. */
  dependencies: UserDetailStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/** Administrative user detail screen component allowing inspection and modification of user accounts. */
export const UserDetailScreen = forwardRef<HTMLDivElement, UserDetailScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <UserDetailProvider dependencies={dependencies}>
          <UserDetailContent strings={strings} />
        </UserDetailProvider>
      </div>
    )
  }
)

UserDetailScreen.displayName = 'UserDetailScreen'
