import React, { forwardRef, useId } from 'react'
import { UserAccountStatus, UserRole } from '@mudrichenkoevgeny/shared-foundation'
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
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import {
  CreateUserProvider,
  useCreateUserStore
} from '@/ui/screens/management/user/create/CreateUserStore'
import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'

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

const getUserRoleLabel = (role: UserRole, strings: FeatureManagementUserStrings): string => {
  switch (role) {
    case UserRole.USER:
      return strings.ui_common_user
    case UserRole.STAFF:
      return strings.ui_common_staff
    case UserRole.ADMIN:
      return strings.ui_common_admin
    default:
      return role
  }
}

const CreateUserContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
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

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-6">
        <CoreBackButton data-testid={CreateUserTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={CreateUserTestTags.TITLE}
          text={strings.create_user_title}
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
          label={strings.email}
          placeholder="user@example.com"
          disabled={isLoading}
        />

        <CorePasswordTextField
          id={passwordId}
          data-testid={CreateUserTestTags.PASSWORD_INPUT}
          value={password}
          onChange={(e) => onPasswordChanged(e.target.value)}
          label={strings.password}
          isPasswordVisible={isPasswordVisible}
          onTogglePasswordVisibility={onTogglePasswordVisibility}
          disabled={isLoading}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor={roleId} className="text-xs font-medium text-surface-foreground">
            {strings.user_role}
          </label>
          <select
            id={roleId}
            data-testid={CreateUserTestTags.ROLE_SELECT}
            value={role}
            onChange={(e) => onRoleChanged(e.target.value as UserRole)}
            disabled={isLoading}
            className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.values(UserRole).map((r) => (
              <option key={`role_${r}`} value={r}>
                {getUserRoleLabel(r, strings)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={statusId} className="text-xs font-medium text-surface-foreground">
            {strings.user_account_status}
          </label>
          <select
            id={statusId}
            data-testid={CreateUserTestTags.STATUS_SELECT}
            value={status}
            onChange={(e) => onStatusChanged(e.target.value as UserAccountStatus)}
            disabled={isLoading}
            className="w-full p-2.5 rounded-md border border-input bg-surface text-surface-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.values(UserAccountStatus).map((st) => (
              <option key={`status_${st}`} value={st}>
                {getUserAccountStatusLabel(st, strings)}
              </option>
            ))}
          </select>
        </div>

        <CoreOutlinedTextField
          id={authLevelId}
          data-testid={CreateUserTestTags.AUTHORITY_LEVEL_INPUT}
          value={authorityLevel}
          onChange={(e) => onAuthorityLevelChanged(e.target.value)}
          label={strings.authority_level}
          disabled={isLoading}
        />

        <div className="flex flex-col gap-2 pt-2">
          <CoreButton
            type="button"
            data-testid={CreateUserTestTags.CREATE_BUTTON}
            label={isLoading ? strings.saving : strings.create_user}
            onClick={onCreateClick}
            disabled={isLoading}
          />

          {error && (
            <CoreErrorText data-testid={CreateUserTestTags.ERROR_TEXT} text={errorParser.parse(error) ?? ''} />
          )}
        </div>
      </div>
    </div>
  )
}

export interface CreateUserScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: CreateUserStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const CreateUserScreen = forwardRef<HTMLDivElement, CreateUserScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
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
