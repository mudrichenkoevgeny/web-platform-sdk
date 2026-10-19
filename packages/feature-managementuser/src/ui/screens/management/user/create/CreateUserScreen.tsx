import React, { forwardRef, useId } from 'react'
import { UserAccountStatus, UserRole, UserModuleStrings, CommonModuleStrings, userStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
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
  useCreateUserStore
} from '@/ui/screens/management/user/create/CreateUserStore'
import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'

/** Automation test tags for {@link CreateUserScreen}. */
export const CreateUserTestTags = {
  BACK_BUTTON: 'CreateUser_BackButton',
  TITLE: 'CreateUser_Title',
  EMAIL_INPUT: 'CreateUser_EmailInput',
  PASSWORD_INPUT: 'CreateUser_PasswordInput',
  ROLE_SELECT: 'CreateUser_RoleSelect',
  STATUS_SELECT: 'CreateUser_StatusSelect',
  AUTHORITY_LEVEL_INPUT: 'CreateUser_AuthorityLevelInput',
  CREATE_BUTTON: 'CreateUser_CreateButton',
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
    default:
      return status
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
    default:
      return role
  }
}

const CreateUserContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const { email, password, isPasswordVisible, role, status, authorityLevel, isLoading, error } = useCreateUserStore((s) => s.screenState)
  const onEmailChanged = useCreateUserStore((s) => s.onEmailChanged)
  const onPasswordChanged = useCreateUserStore((s) => s.onPasswordChanged)
  const onTogglePasswordVisibility = useCreateUserStore((s) => s.onTogglePasswordVisibility)
  const onRoleChanged = useCreateUserStore((s) => s.onRoleChanged)
  const onStatusChanged = useCreateUserStore((s) => s.onStatusChanged)
  const onAuthorityLevelChanged = useCreateUserStore((s) => s.onAuthorityLevelChanged)
  const onCreateClick = useCreateUserStore((s) => s.onCreateClick)
  const onBackClick = useCreateUserStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const emailId = useId()
  const passwordId = useId()
  const roleId = useId()
  const statusId = useId()
  const authLevelId = useId()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void onCreateClick()
  }

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
        <CoreEmailTextField
          id={emailId}
          data-testid={CreateUserTestTags.EMAIL_INPUT}
          value={email}
          onChange={(e) => onEmailChanged(e.target.value)}
          label={strings.ui.email}
          placeholder="user@example.com"
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

        <div className="flex flex-col gap-2 pt-2">
          <CoreButton
            type="submit"
            data-testid={CreateUserTestTags.CREATE_BUTTON}
            label={isLoading ? strings.ui.saving : strings.ui.createUser}
            onClick={onCreateClick}
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
  dependencies: CreateUserStoreDependencies
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
