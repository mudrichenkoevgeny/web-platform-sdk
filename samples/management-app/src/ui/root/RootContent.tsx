import React, { useEffect, useMemo, useState } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { AppType, type UserId } from '@mudrichenkoevgeny/shared-foundation'
import { SdkProvider, ThemeProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementLoginRootStoreDependencies, ManagementRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import type { ManagementAppComponent } from '@/di/management-app-component'
import { ManagementAppComponentProvider } from '@/di/management-app-context'
import { InitialLoader } from '@/ui/screen/loader/InitialLoader'
import { router } from '@/router'

export interface RootContentProps {
  readonly managementAppComponent: ManagementAppComponent
}

/**
 * Top-level sample UI: initializes SDK services, fetches user configuration, connects WebSockets,
 * then displays {@link MainScreen}.
 */
export function RootContent({ managementAppComponent }: RootContentProps): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(managementAppComponent.isInitialized)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      managementAppComponent.init()
      await managementAppComponent.refreshUserConfigurationUseCase.execute()
      managementAppComponent.commonComponent.webSocketService.connect()
      if (isMounted) {
        setIsInitialized(true)
      }
    }

    if (!isInitialized) {
      void initialize()
    }

    return () => {
      isMounted = false
    }
  }, [managementAppComponent, isInitialized])

  const [currentUserId, setCurrentUserId] = useState<UserId | null>(null)

  useEffect(() => {
    return managementAppComponent.managementUserComponent.selfManagementUserRepository.observeCurrentUser((user) => {
      setCurrentUserId(user?.id ?? null)
    })
  }, [managementAppComponent])

  const loginDependencies: ManagementLoginRootStoreDependencies = useMemo(
    () => ({
      appType: AppType.MANAGEMENT,
      getOpenGlobalSettingsUseCase: managementAppComponent.settingsComponent.getOpenGlobalSettingsUseCase,
      getAvailableUserAuthProvidersUseCase: managementAppComponent.managementUserComponent.getAvailableUserAuthProvidersUseCase,
      loginByEmailUseCase: managementAppComponent.managementUserComponent.loginByEmailUseCase,
      resetPasswordRepository: managementAppComponent.managementUserComponent.selfManagementResetPasswordRepository,
      sendResetPasswordConfirmationToEmailUseCase: managementAppComponent.managementUserComponent.sendResetPasswordConfirmationToEmailUseCase,
      resetEmailPasswordUseCase: managementAppComponent.managementUserComponent.resetEmailPasswordUseCase,
      validatePasswordUseCase: managementAppComponent.securityComponent.validatePasswordUseCase,
      loginByTotpUseCase: managementAppComponent.managementUserComponent.loginByTotpUseCase,
      loginByTotpRecoveryCodeUseCase: managementAppComponent.managementUserComponent.loginByTotpRecoveryCodeUseCase,
      restoreUserUseCase: managementAppComponent.managementUserComponent.restoreUserUseCase,
      logoutUseCase: managementAppComponent.managementUserComponent.logoutUseCase,
      getUserIdentifiersUseCase: managementAppComponent.managementUserComponent.getUserIdentifiersUseCase,
      sendUnlockEmailConfirmationUseCase: managementAppComponent.managementUserComponent.sendUnlockEmailConfirmationUseCase,
      sendUnlockPhoneConfirmationUseCase: managementAppComponent.managementUserComponent.sendUnlockPhoneConfirmationUseCase,
      unlockByEmailUseCase: managementAppComponent.managementUserComponent.unlockByEmailUseCase,
      unlockByPhoneUseCase: managementAppComponent.managementUserComponent.unlockByPhoneUseCase,
      externalLauncher: managementAppComponent.commonComponent.externalLauncher,
      onDismiss: () => void router.navigate({ to: '/management', replace: true }),
      onFinished: () => void router.navigate({ to: '/management', replace: true })
    }),
    [managementAppComponent]
  )

  const managementDependencies: ManagementRootStoreDependencies = useMemo(
    () => ({
      currentUserId,
      onNavigateToProfile: () => void router.navigate({ to: '/management/profile' }),
      getManagementAuthSettingsUseCase: managementAppComponent.managementUserComponent.getManagementAuthSettingsUseCase,
      saveRemoteAuthSettingsUseCase: managementAppComponent.managementUserComponent.saveRemoteAuthSettingsUseCase,
      resetRemoteAuthSettingsUseCase: managementAppComponent.managementUserComponent.resetRemoteAuthSettingsUseCase,
      getManagementGlobalSettingsUseCase: managementAppComponent.managementUserComponent.getManagementGlobalSettingsUseCase,
      saveRemoteGlobalSettingsUseCase: managementAppComponent.managementUserComponent.saveRemoteGlobalSettingsUseCase,
      resetRemoteGlobalSettingsUseCase: managementAppComponent.managementUserComponent.resetRemoteGlobalSettingsUseCase,
      getManagementSecuritySettingsUseCase: managementAppComponent.managementUserComponent.getManagementSecuritySettingsUseCase,
      saveRemoteSecuritySettingsUseCase: managementAppComponent.managementUserComponent.saveRemoteSecuritySettingsUseCase,
      resetRemoteSecuritySettingsUseCase: managementAppComponent.managementUserComponent.resetRemoteSecuritySettingsUseCase,
      getUsersUseCase: managementAppComponent.managementUserComponent.getUsersUseCase,
      getUserUseCase: managementAppComponent.managementUserComponent.getUserUseCase,
      createUserUseCase: managementAppComponent.managementUserComponent.createUserUseCase,
      updateUserUseCase: managementAppComponent.managementUserComponent.updateUserUseCase,
      deleteUserUseCase: managementAppComponent.managementUserComponent.deleteUserUseCase,
      managementGetSessionsUseCase: managementAppComponent.managementUserComponent.managementGetSessionsUseCase,
      managementGetSessionUseCase: managementAppComponent.managementUserComponent.managementGetSessionUseCase,
      managementGetIdentifiersUseCase: managementAppComponent.managementUserComponent.managementGetIdentifiersUseCase,
      managementGetIdentifierUseCase: managementAppComponent.managementUserComponent.managementGetIdentifierUseCase,
      managementDisableTotpUseCase: managementAppComponent.managementUserComponent.managementDisableTotpUseCase,
      managementDeleteSessionUseCase: managementAppComponent.managementUserComponent.managementDeleteSessionUseCase,
      managementDeleteAllUserSessionsUseCase: managementAppComponent.managementUserComponent.managementDeleteAllUserSessionsUseCase,
      managementDeleteIdentifierUseCase: managementAppComponent.managementUserComponent.managementDeleteIdentifierUseCase,
      managementDeleteIdentifierPasswordUseCase: managementAppComponent.managementUserComponent.managementDeleteIdentifierPasswordUseCase,
      getAuditEventsUseCase: managementAppComponent.managementUserComponent.getAuditEventsUseCase,
      getAuditEventUseCase: managementAppComponent.managementUserComponent.getAuditEventUseCase,
      selfManagementUserRepository: managementAppComponent.managementUserComponent.selfManagementUserRepository
    }),
    [managementAppComponent, currentUserId]
  )

  if (!isInitialized) {
    return <InitialLoader />
  }

  return (
    <SdkProvider component={managementAppComponent.commonComponent}>
      <ManagementAppComponentProvider component={managementAppComponent}>
        <ThemeProvider>
          <RouterProvider
            router={router}
            context={{
              appComponent: managementAppComponent,
              managementDeps: managementDependencies,
              loginDependencies
            }}
          />
        </ThemeProvider>
      </ManagementAppComponentProvider>
    </SdkProvider>
  )
}
