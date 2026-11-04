import React, { forwardRef, useEffect, useId, useRef } from 'react'
import { UserAccountStatus, UserRole, UserModuleStrings, CommonModuleStrings, userStrings, commonStrings, UiValues, StorageCategory } from '@mudrichenkoevgeny/shared-foundation'
import { FieldValidator } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreEmailTextField,
  CoreErrorText,
  CoreOutlinedTextField,
  CorePasswordTextField,
  CoreScreenTitleText,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  CreateUserProvider,
  SelectedFilePayload,
  useCreateUserStore
} from '@/ui/screens/management/user/create/CreateUserStore'
import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'
import { StorageFileImagePreview } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'

/** Automation test tags for {@link CreateUserScreen}. */
export const CreateUserTestTags = {
  /** Test tag for back button. */
  BACK_BUTTON: 'CreateUser_BackButton',
  /** Test tag for screen title. */
  TITLE: 'CreateUser_Title',
  /** Test tag for email input field. */
  EMAIL_INPUT: 'CreateUser_EmailInput',
  /** Test tag for password input field. */
  PASSWORD_INPUT: 'CreateUser_PasswordInput',
  /** Test tag for nickname input field. */
  NICKNAME_INPUT: 'CreateUser_NicknameInput',
  /** Test tag for display name input field. */
  DISPLAY_NAME_INPUT: 'CreateUser_DisplayNameInput',
  /** Test tag for avatar change button. */
  AVATAR_CHANGE_BUTTON: 'CreateUser_AvatarChangeButton',
  /** Test tag for remove avatar button. */
  REMOVE_AVATAR_BUTTON: 'CreateUser_RemoveAvatarButton',
  /** Test tag for birthdate input field. */
  BIRTHDATE_INPUT: 'CreateUser_BirthdateInput',
  /** Test tag for role select element. */
  ROLE_SELECT: 'CreateUser_RoleSelect',
  /** Test tag for status select element. */
  STATUS_SELECT: 'CreateUser_StatusSelect',
  /** Test tag for authority level input field. */
  AUTHORITY_LEVEL_INPUT: 'CreateUser_AuthorityLevelInput',
  /** Test tag for storage quota bytes input field. */
  STORAGE_QUOTA_INPUT: 'CreateUser_StorageQuotaInput',
  /** Test tag for storage max upload size bytes input field. */
  STORAGE_MAX_UPLOAD_INPUT: 'CreateUser_StorageMaxUploadInput',
  /** Test tag for storage max pending uploads input field. */
  STORAGE_MAX_PENDING_INPUT: 'CreateUser_StorageMaxPendingInput',
  /** Test tag for create button. */
  CREATE_BUTTON: 'CreateUser_CreateButton',
  /** Test tag for error text. */
  ERROR_TEXT: 'CreateUser_ErrorText'
}

/**
 * Type guard validating whether a value is a valid {@link UserRole}.
 *
 * @param value - Value to test
 * @returns True if value is a valid {@link UserRole}
 */
const isUserRole = (value: unknown): value is UserRole => {
  return typeof value === 'string' && Object.values(UserRole).some((v) => v === value)
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
 * Resolves localized display label for {@link UserRole}.
 *
 * @param role - User role
 * @param strings - Common localized strings
 * @returns Localized user role label
 */
const getUserRoleLabel = (role: UserRole, strings: CommonModuleStrings): string => {
  switch (role) {
    case UserRole.USER:
      return strings.ui.user
    case UserRole.STAFF:
      return strings.ui.staff
    case UserRole.ADMIN:
      return strings.ui.admin
  }
}

const CreateUserContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const {
    email,
    password,
    nickname,
    displayName,
    isPasswordVisible,
    selectedAvatarPayload,
    birthdate,
    role,
    status,
    authorityLevel,
    storageQuotaBytes,
    storageMaxUploadSizeBytes,
    storageMaxPendingUploads,
    isLoading,
    error
  } = useCreateUserStore((s) => s.screenState)

  const onEmailChanged = useCreateUserStore((s) => s.onEmailChanged)
  const onPasswordChanged = useCreateUserStore((s) => s.onPasswordChanged)
  const onNicknameChanged = useCreateUserStore((s) => s.onNicknameChanged)
  const onDisplayNameChanged = useCreateUserStore((s) => s.onDisplayNameChanged)
  const onTogglePasswordVisibility = useCreateUserStore((s) => s.onTogglePasswordVisibility)
  const onAvatarFileSelected = useCreateUserStore((s) => s.onAvatarFileSelected)
  const onRemoveAvatarClick = useCreateUserStore((s) => s.onRemoveAvatarClick)
  const onBirthdateChanged = useCreateUserStore((s) => s.onBirthdateChanged)
  const onRoleChanged = useCreateUserStore((s) => s.onRoleChanged)
  const onStatusChanged = useCreateUserStore((s) => s.onStatusChanged)
  const onAuthorityLevelChanged = useCreateUserStore((s) => s.onAuthorityLevelChanged)
  const onStorageQuotaBytesChanged = useCreateUserStore((s) => s.onStorageQuotaBytesChanged)
  const onStorageMaxUploadSizeBytesChanged = useCreateUserStore((s) => s.onStorageMaxUploadSizeBytesChanged)
  const onStorageMaxPendingUploadsChanged = useCreateUserStore((s) => s.onStorageMaxPendingUploadsChanged)
  const onCreateClick = useCreateUserStore((s) => s.onCreateClick)
  const onBackClick = useCreateUserStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const emailId = useId()
  const passwordId = useId()
  const nicknameId = useId()
  const displayNameId = useId()
  const birthdateId = useId()
  const roleId = useId()
  const statusId = useId()
  const authLevelId = useId()
  const storageQuotaId = useId()
  const storageMaxUploadId = useId()
  const storageMaxPendingId = useId()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previousAvatarUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (previousAvatarUrlRef.current && previousAvatarUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previousAvatarUrlRef.current)
      }
    }
  }, [])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void onCreateClick()
  }

  const avatarUrl = selectedAvatarPayload?.localUri ?? null

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto"
    >
      <div className="w-full flex items-center justify-between relative mb-6">
        <CoreBackButton data-testid={CreateUserTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={CreateUserTestTags.TITLE}
          text={strings.ui.createUserTitle}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-4 mb-6">
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-accent flex items-center justify-center relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={strings.ui.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-muted-foreground font-bold">
                {(displayName || nickname || strings.ui.user || strings.ui.createUserTitle).charAt(0).toUpperCase()}
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
              data-testid={CreateUserTestTags.AVATAR_CHANGE_BUTTON}
              label={`${strings.ui.editProfileTitle} (${strings.ui.avatar})`}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            />
            {avatarUrl && (
              <CoreButton
                type="button"
                data-testid={CreateUserTestTags.REMOVE_AVATAR_BUTTON}
                label={strings.ui.removeAvatar}
                onClick={handleRemoveAvatar}
                disabled={isLoading}
              />
            )}
          </div>
        </div>

        <CoreEmailTextField
          id={emailId}
          data-testid={CreateUserTestTags.EMAIL_INPUT}
          value={email}
          onChange={(e) => onEmailChanged(e.target.value)}
          label={strings.ui.email}
          placeholder={UiValues.Placeholder.EMAIL}
          autoComplete="off"
          disabled={isLoading}
        />

        <CorePasswordTextField
          id={passwordId}
          data-testid={CreateUserTestTags.PASSWORD_INPUT}
          value={password}
          onChange={(e) => onPasswordChanged(e.target.value)}
          label={strings.ui.password}
          isPasswordVisible={isPasswordVisible}
          onTogglePasswordVisibility={onTogglePasswordVisibility}
          autoComplete="new-password"
          disabled={isLoading}
        />

        <CoreOutlinedTextField
          id={displayNameId}
          data-testid={CreateUserTestTags.DISPLAY_NAME_INPUT}
          value={displayName}
          onChange={(e) => onDisplayNameChanged(e.target.value)}
          label={strings.ui.user}
          disabled={isLoading}
        />

        <CoreOutlinedTextField
          id={nicknameId}
          data-testid={CreateUserTestTags.NICKNAME_INPUT}
          value={nickname}
          onChange={(e) => onNicknameChanged(e.target.value)}
          label={strings.ui.userLabel}
          disabled={isLoading}
        />

        <CoreOutlinedTextField
          id={birthdateId}
          data-testid={CreateUserTestTags.BIRTHDATE_INPUT}
          type="number"
          value={birthdate}
          onChange={(e) => onBirthdateChanged(e.target.value)}
          label={strings.ui.birthdate}
          disabled={isLoading}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor={roleId} className="text-xs font-medium text-surface-foreground">
            {strings.ui.userRole}
          </label>
          <select
            id={roleId}
            data-testid={CreateUserTestTags.ROLE_SELECT}
            value={role}
            onChange={(e) => {
              const val = e.target.value
              if (isUserRole(val)) {
                onRoleChanged(val)
              }
            }}
            disabled={isLoading}
            className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {[UserRole.USER, UserRole.STAFF, UserRole.ADMIN].map((r) => (
              <option key={`role_${r}`} value={r}>
                {getUserRoleLabel(r, commonStrings)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={statusId} className="text-xs font-medium text-surface-foreground">
            {strings.ui.userAccountStatus}
          </label>
          <select
            id={statusId}
            data-testid={CreateUserTestTags.STATUS_SELECT}
            value={status}
            onChange={(e) => {
              const val = e.target.value
              if (isUserAccountStatus(val)) {
                onStatusChanged(val)
              }
            }}
            disabled={isLoading}
            className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {[
              UserAccountStatus.ACTIVE,
              UserAccountStatus.READ_ONLY,
              UserAccountStatus.BANNED,
              UserAccountStatus.SECURITY_HOLD,
              UserAccountStatus.PENDING_DELETION
            ].map((st) => (
              <option key={`status_${st}`} value={st}>
                {getUserAccountStatusLabel(st, commonStrings)}
              </option>
            ))}
          </select>
        </div>

        <CoreOutlinedTextField
          id={authLevelId}
          data-testid={CreateUserTestTags.AUTHORITY_LEVEL_INPUT}
          value={authorityLevel}
          onChange={(e) => onAuthorityLevelChanged(e.target.value)}
          label={strings.ui.authorityLevel}
          disabled={isLoading}
        />

        <div className="pt-2 border-t border-border flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {strings.ui.customStorageConfiguration}
          </p>

          <CoreOutlinedTextField
            id={storageQuotaId}
            data-testid={CreateUserTestTags.STORAGE_QUOTA_INPUT}
            type="number"
            value={storageQuotaBytes}
            onChange={(e) => onStorageQuotaBytesChanged(e.target.value)}
            label={strings.ui.userStorageQuotaOptional}
            placeholder={strings.ui.defaultNullPlaceholder}
            disabled={isLoading}
          />

          <CoreOutlinedTextField
            id={storageMaxUploadId}
            data-testid={CreateUserTestTags.STORAGE_MAX_UPLOAD_INPUT}
            type="number"
            value={storageMaxUploadSizeBytes}
            onChange={(e) => onStorageMaxUploadSizeBytesChanged(e.target.value)}
            label={strings.ui.userMaxUploadSizeOptional}
            placeholder={strings.ui.defaultNullPlaceholder}
            disabled={isLoading}
          />

          <CoreOutlinedTextField
            id={storageMaxPendingId}
            data-testid={CreateUserTestTags.STORAGE_MAX_PENDING_INPUT}
            type="number"
            value={storageMaxPendingUploads}
            onChange={(e) => onStorageMaxPendingUploadsChanged(e.target.value)}
            label={strings.ui.userMaxPendingUploadsOptional}
            placeholder={strings.ui.defaultNullPlaceholder}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <CoreButton
            type="submit"
            data-testid={CreateUserTestTags.CREATE_BUTTON}
            label={isLoading ? strings.ui.saving : strings.ui.createUser}
            disabled={isLoading || !FieldValidator.isValidEmail(email)}
          />

          {error && (
            <CoreErrorText
              data-testid={CreateUserTestTags.ERROR_TEXT}
              text={errorParser.parse(error) ?? ''}
            />
          )}
        </div>
      </div>
    </form>
  )
}

/** Props for {@link CreateUserScreen}. */
export interface CreateUserScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Store dependencies required for initialization and creation flow. */
  dependencies: CreateUserStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/** Screen component for creating a new user account with role and status options. */
export const CreateUserScreen = forwardRef<HTMLDivElement, CreateUserScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <CreateUserProvider dependencies={dependencies}>
          <CreateUserContent strings={strings} />
        </CreateUserProvider>
      </div>
    )
  }
)

CreateUserScreen.displayName = 'CreateUserScreen'
