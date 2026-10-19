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
import { AppType, UserAccountStatus, UserModuleStrings, userStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  MainUserProvider,
  MainUserStatus,
  useMainUserStore
} from '@/ui/screens/user/main/main-user-store'
import type { MainUserStoreDependencies } from '@/ui/screens/user/main/main-user-store'

/**
 * Automation test tags for {@link MainUserScreen}.
 */
export const MainUserTestTags = {
  LOGIN_BUTTON: 'MainUser_LoginButton',
  ACCOUNT_STATUS_TEXT: 'MainUser_AccountStatusText',
  AUTHORITY_LEVEL_TEXT: 'MainUser_AuthorityLevelText',
  PERMISSION_CODES_TEXT: 'MainUser_PermissionCodesText',
  USER_ID_TEXT: 'MainUser_UserIdText',
  TOTP_MAIN_BUTTON: 'MainUser_TotpMainButton',
  SESSIONS_BUTTON: 'MainUser_SessionsButton',
  IDENTIFIERS_BUTTON: 'MainUser_IdentifiersButton',
  DELETE_ACCOUNT_BUTTON: 'MainUser_DeleteAccountButton',
  LOGOUT_BUTTON: 'MainUser_LogoutButton',
  ACTION_ERROR_TEXT: 'MainUser_ActionErrorText',
  GLOBAL_ERROR_TEXT: 'MainUser_GlobalErrorText',
  REFRESH_BUTTON: 'MainUser_RefreshButton'
}

const MainUserContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const screenState = useMainUserStore((s) => s.screenState)
  const onRefresh = useMainUserStore((s) => s.onRefresh)
  const onLoginClick = useMainUserStore((s) => s.onLoginClick)
  const onLogoutClick = useMainUserStore((s) => s.onLogoutClick)
  const onConfirmLogout = useMainUserStore((s) => s.onConfirmLogout)
  const onTotpMainClick = useMainUserStore((s) => s.onTotpMainClick)
  const onSessionsClick = useMainUserStore((s) => s.onSessionsClick)
  const onIdentifiersClick = useMainUserStore((s) => s.onIdentifiersClick)
  const onDeleteAccountClick = useMainUserStore((s) => s.onDeleteAccountClick)
  const onConfirmDeleteAccount = useMainUserStore((s) => s.onConfirmDeleteAccount)
  const onDismissDialog = useMainUserStore((s) => s.onDismissDialog)
  const errorParser = useAppErrorParser()

  switch (screenState.status) {
    case MainUserStatus.LOADING:
      return <FullscreenLoading />

    case MainUserStatus.ERROR:
      return (
        <div className="w-full h-full flex items-center justify-center p-6">
          <CoreErrorText
            text={errorParser.parse(screenState.error) ?? ''}
            data-testid={MainUserTestTags.GLOBAL_ERROR_TEXT}
          />
        </div>
      )

    case MainUserStatus.UNAUTHORIZED:
      return (
        <div className="w-full h-full p-6 flex flex-col items-center justify-center gap-4">
          <CoreButton
            type="button"
            label={strings.ui.signIn}
            onClick={onLoginClick}
            data-testid={MainUserTestTags.LOGIN_BUTTON}
          />
          {screenState.actionError && (
            <CoreErrorText
              text={errorParser.parse(screenState.actionError) ?? ''}
              data-testid={MainUserTestTags.ACTION_ERROR_TEXT}
            />
          )}
        </div>
      )

    case MainUserStatus.CONTENT: {
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
            return strings.ui.accountStatusActive
          case UserAccountStatus.READ_ONLY:
            return strings.ui.accountStatusReadOnly
          case UserAccountStatus.BANNED:
            return strings.ui.accountStatusBanned
          case UserAccountStatus.SECURITY_HOLD:
            return strings.ui.accountStatusSecurityHold
          case UserAccountStatus.PENDING_DELETION:
            return strings.ui.accountStatusPendingDeletion
          default:
            return strings.ui.accountStatusActive
        }
      }

      const permissionsText = user.permissionCodes.length > 0
        ? user.permissionCodes.join(', ')
        : strings.ui.permissionsNone

      return (
        <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-surface-foreground">
              {strings.ui.user}
            </h2>
            <button
              type="button"
              onClick={onRefresh}
              disabled={actionLoading}
              aria-label={commonStrings.ui.retry}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              data-testid={MainUserTestTags.REFRESH_BUTTON}
            >
              <CoreIcon src={icons.refresh} size={20} />
            </button>
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center gap-3 my-auto text-center">
            <span
              className="text-base font-semibold text-surface-foreground"
              data-testid={MainUserTestTags.USER_ID_TEXT}
            >
              {user.id ?? ''}
            </span>

            <span
              className="text-sm text-muted-foreground"
              data-testid={MainUserTestTags.ACCOUNT_STATUS_TEXT}
            >
              {strings.ui.accountStatusPrefix(getAccountStatusText(user.accountStatus))}
            </span>

            {appType === AppType.MANAGEMENT && (
              <>
                <span
                  className="text-sm text-muted-foreground"
                  data-testid={MainUserTestTags.AUTHORITY_LEVEL_TEXT}
                >
                  {strings.ui.authorityLevelPrefix(user.authorityLevel)}
                </span>

                <span
                  className="text-sm text-muted-foreground"
                  data-testid={MainUserTestTags.PERMISSION_CODES_TEXT}
                >
                  {strings.ui.permissionCodesPrefix(permissionsText)}
                </span>
              </>
            )}

            <div className="w-full max-w-sm flex flex-col gap-2 mt-4">
              <CoreButton
                type="button"
                label={strings.ui.totpMain}
                onClick={onTotpMainClick}
                disabled={actionLoading}
                data-testid={MainUserTestTags.TOTP_MAIN_BUTTON}
              />

              <CoreButton
                type="button"
                label={strings.ui.sessions}
                onClick={onSessionsClick}
                disabled={actionLoading}
                data-testid={MainUserTestTags.SESSIONS_BUTTON}
              />

              <CoreButton
                type="button"
                label={strings.ui.identifiers}
                onClick={onIdentifiersClick}
                disabled={actionLoading}
                data-testid={MainUserTestTags.IDENTIFIERS_BUTTON}
              />

              {isAccountDeletionAvailable && (
                <CoreButton
                  type="button"
                  label={strings.ui.deleteAccount}
                  onClick={onDeleteAccountClick}
                  disabled={actionLoading}
                  data-testid={MainUserTestTags.DELETE_ACCOUNT_BUTTON}
                />
              )}

              <CoreButton
                type="button"
                label={strings.ui.logout}
                onClick={onLogoutClick}
                disabled={actionLoading}
                data-testid={MainUserTestTags.LOGOUT_BUTTON}
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
                  data-testid={MainUserTestTags.ACTION_ERROR_TEXT}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <button
                type="button"
                aria-label={strings.ui.dialogCancel}
                onClick={onDismissDialog}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default border-none outline-none"
              />
              <div
                className="relative z-10 bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
              >
                <h3 id="delete-account-dialog-title" className="text-lg font-bold text-surface-foreground">
                  {strings.ui.dialogConfirmTitle}
                </h3>
                <p id="delete-account-dialog-desc" className="text-sm text-muted-foreground">
                  {strings.ui.deleteAccountConfirmMsg}
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <CoreTextButton
                    type="button"
                    label={strings.ui.dialogCancel}
                    onClick={onDismissDialog}
                  />
                  <CoreTextButton
                    type="button"
                    label={strings.ui.dialogConfirm}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <button
                type="button"
                aria-label={strings.ui.dialogCancel}
                onClick={onDismissDialog}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default border-none outline-none"
              />
              <div
                className="relative z-10 bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
              >
                <h3 id="logout-dialog-title" className="text-lg font-bold text-surface-foreground">
                  {strings.ui.dialogConfirmTitle}
                </h3>
                <p id="logout-dialog-desc" className="text-sm text-muted-foreground">
                  {strings.ui.logoutConfirmMsg}
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <CoreTextButton
                    type="button"
                    label={strings.ui.dialogCancel}
                    onClick={onDismissDialog}
                  />
                  <CoreTextButton
                    type="button"
                    label={strings.ui.dialogConfirm}
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
  }
}

/**
 * Props for {@link MainUserScreen}.
 */
export interface MainUserScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: MainUserStoreDependencies
  strings?: UserModuleStrings
}

/**
 * Main user screen component showing signed-in user details and navigation actions.
 */
export const MainUserScreen = forwardRef<HTMLDivElement, MainUserScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <MainUserProvider dependencies={dependencies}>
          <MainUserContent strings={strings} />
        </MainUserProvider>
      </div>
    )
  }
)

MainUserScreen.displayName = 'MainUserScreen'
