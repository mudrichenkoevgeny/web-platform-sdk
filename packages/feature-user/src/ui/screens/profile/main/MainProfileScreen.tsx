import React, { forwardRef } from 'react'
import {
  cn,
  CoreButton,
  CoreErrorText,
  CoreIcon,
  CoreTextButton,
  FullscreenLoading,
  FullscreenOverlayLoading,
  icons,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import { AppType, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import {
  MainProfileProvider,
  useMainProfileStore
} from '@/ui/screens/profile/main/main-profile-store'
import type { MainProfileStoreDependencies } from "@/ui/screens/profile/main/main-profile-store";

/**
 * Automation test tags for {@link MainProfileScreen}.
 */
export const MainProfileTestTags = {
  LOGIN_BUTTON: 'MainProfile_LoginButton',
  ACCOUNT_STATUS_TEXT: 'MainProfile_AccountStatusText',
  AUTHORITY_LEVEL_TEXT: 'MainProfile_AuthorityLevelText',
  PERMISSION_CODES_TEXT: 'MainProfile_PermissionCodesText',
  USER_ID_TEXT: 'MainProfile_UserIdText',
  TOTP_MAIN_BUTTON: 'MainProfile_TotpMainButton',
  SESSIONS_BUTTON: 'MainProfile_SessionsButton',
  IDENTIFIERS_BUTTON: 'MainProfile_IdentifiersButton',
  DELETE_ACCOUNT_BUTTON: 'MainProfile_DeleteAccountButton',
  LOGOUT_BUTTON: 'MainProfile_LogoutButton',
  ACTION_ERROR_TEXT: 'MainProfile_ActionErrorText',
  GLOBAL_ERROR_TEXT: 'MainProfile_GlobalErrorText',
  REFRESH_BUTTON: 'MainProfile_RefreshButton'
}

const MainProfileContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useMainProfileStore((s) => s.screenState)
  const onRefresh = useMainProfileStore((s) => s.onRefresh)
  const onLoginClick = useMainProfileStore((s) => s.onLoginClick)
  const onLogoutClick = useMainProfileStore((s) => s.onLogoutClick)
  const onConfirmLogout = useMainProfileStore((s) => s.onConfirmLogout)
  const onTotpMainClick = useMainProfileStore((s) => s.onTotpMainClick)
  const onSessionsClick = useMainProfileStore((s) => s.onSessionsClick)
  const onIdentifiersClick = useMainProfileStore((s) => s.onIdentifiersClick)
  const onDeleteAccountClick = useMainProfileStore((s) => s.onDeleteAccountClick)
  const onConfirmDeleteAccount = useMainProfileStore((s) => s.onConfirmDeleteAccount)
  const onDismissDialog = useMainProfileStore((s) => s.onDismissDialog)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <CoreErrorText
          text={errorParser.parse(screenState.error) ?? ''}
          data-testid={MainProfileTestTags.GLOBAL_ERROR_TEXT}
        />
      </div>
    )
  }

  if (screenState.status === 'unauthorized') {
    return (
      <div className="w-full h-full p-6 flex flex-col items-center justify-center gap-4">
        <CoreButton
          type="button"
          label={strings.sign_in}
          onClick={onLoginClick}
          data-testid={MainProfileTestTags.LOGIN_BUTTON}
        />
        {screenState.actionError && (
          <CoreErrorText
            text={errorParser.parse(screenState.actionError) ?? ''}
            data-testid={MainProfileTestTags.ACTION_ERROR_TEXT}
          />
        )}
      </div>
    )
  }

  const {
    user,
    appType,
    isAccountDeletionAvailable,
    showDeleteConfirmation,
    showLogoutConfirmation,
    actionLoading,
    actionError
  } = screenState

  const getAccountStatusText = (status: UserAccountStatus): string => {
    switch (status) {
      case UserAccountStatus.ACTIVE:
        return strings.account_status_active
      case UserAccountStatus.READ_ONLY:
        return strings.account_status_read_only
      case UserAccountStatus.BANNED:
        return strings.account_status_banned
      case UserAccountStatus.SECURITY_HOLD:
        return strings.account_status_security_hold
      case UserAccountStatus.PENDING_DELETION:
        return strings.account_status_pending_deletion
      default:
        return strings.account_status_active
    }
  }

  const permissionsText = user.permissionCodes.length > 0
    ? user.permissionCodes.join(', ')
    : strings.permissions_none

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-surface-foreground">
          {strings.profile}
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          disabled={actionLoading}
          aria-label={strings.retry}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          data-testid={MainProfileTestTags.REFRESH_BUTTON}
        >
          <CoreIcon src={icons.refresh} size={20} />
        </button>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center gap-3 my-auto text-center">
        <span
          className="text-base font-semibold text-surface-foreground"
          data-testid={MainProfileTestTags.USER_ID_TEXT}
        >
          {strings.user_id(user.id)}
        </span>

        <span
          className="text-sm text-muted-foreground"
          data-testid={MainProfileTestTags.ACCOUNT_STATUS_TEXT}
        >
          {strings.account_status_prefix(getAccountStatusText(user.accountStatus))}
        </span>

        {appType === AppType.MANAGEMENT && (
          <>
            <span
              className="text-sm text-muted-foreground"
              data-testid={MainProfileTestTags.AUTHORITY_LEVEL_TEXT}
            >
              {strings.authority_level_prefix(user.authorityLevel)}
            </span>

            <span
              className="text-sm text-muted-foreground"
              data-testid={MainProfileTestTags.PERMISSION_CODES_TEXT}
            >
              {strings.permission_codes_prefix(permissionsText)}
            </span>
          </>
        )}

        <div className="w-full max-w-sm flex flex-col gap-2 mt-4">
          <CoreButton
            type="button"
            label={strings.totp_main}
            onClick={onTotpMainClick}
            disabled={actionLoading}
            data-testid={MainProfileTestTags.TOTP_MAIN_BUTTON}
          />

          <CoreButton
            type="button"
            label={strings.sessions}
            onClick={onSessionsClick}
            disabled={actionLoading}
            data-testid={MainProfileTestTags.SESSIONS_BUTTON}
          />

          <CoreButton
            type="button"
            label={strings.identifiers}
            onClick={onIdentifiersClick}
            disabled={actionLoading}
            data-testid={MainProfileTestTags.IDENTIFIERS_BUTTON}
          />

          {isAccountDeletionAvailable && (
            <CoreButton
              type="button"
              label={strings.delete_account}
              onClick={onDeleteAccountClick}
              disabled={actionLoading}
              data-testid={MainProfileTestTags.DELETE_ACCOUNT_BUTTON}
            />
          )}

          <CoreButton
            type="button"
            label={strings.logout}
            onClick={onLogoutClick}
            disabled={actionLoading}
            data-testid={MainProfileTestTags.LOGOUT_BUTTON}
          />
        </div>

        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden w-full text-center',
            actionError ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          )}
        >
          {actionError && (
            <CoreErrorText
              text={errorParser.parse(actionError) ?? ''}
              data-testid={MainProfileTestTags.ACTION_ERROR_TEXT}
            />
          )}
        </div>
      </div>

      {showDeleteConfirmation && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-account-dialog-title"
          aria-describedby="delete-account-dialog-desc"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onDismissDialog}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
          >
            <h3 id="delete-account-dialog-title" className="text-lg font-bold text-surface-foreground">
              {strings.dialog_confirm_title}
            </h3>
            <p id="delete-account-dialog-desc" className="text-sm text-muted-foreground">
              {strings.delete_account_confirm_msg}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton
                type="button"
                label={strings.dialog_cancel}
                onClick={onDismissDialog}
              />
              <CoreTextButton
                type="button"
                label={strings.dialog_confirm}
                onClick={onConfirmDeleteAccount}
              />
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirmation && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-desc"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onDismissDialog}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
          >
            <h3 id="logout-dialog-title" className="text-lg font-bold text-surface-foreground">
              {strings.dialog_confirm_title}
            </h3>
            <p id="logout-dialog-desc" className="text-sm text-muted-foreground">
              {strings.logout_confirm_msg}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton
                type="button"
                label={strings.dialog_cancel}
                onClick={onDismissDialog}
              />
              <CoreTextButton
                type="button"
                label={strings.dialog_confirm}
                onClick={onConfirmLogout}
              />
            </div>
          </div>
        </div>
      )}

      {actionLoading && <FullscreenOverlayLoading />}
    </div>
  )
}

/**
 * Props for {@link MainProfileScreen}.
 */
export interface MainProfileScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: MainProfileStoreDependencies
  strings?: FeatureUserStrings
}

/**
 * Main profile screen component showing signed-in user details and navigation actions.
 */
export const MainProfileScreen = forwardRef<HTMLDivElement, MainProfileScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <MainProfileProvider dependencies={dependencies}>
          <MainProfileContent strings={strings} />
        </MainProfileProvider>
      </div>
    )
  }
)

MainProfileScreen.displayName = 'MainProfileScreen'
