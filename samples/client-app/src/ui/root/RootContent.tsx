import React, { useEffect, useMemo, useState } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { SdkProvider, ThemeProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ClientLoginRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import type { ClientAppComponent } from '@/di/client-app-component'
import { ClientAppComponentProvider } from '@/di/client-app-context'
import { InitialLoader } from '@/ui/screen/loader/InitialLoader'
import { router } from '@/router'

export interface RootContentProps {
  readonly clientAppComponent: ClientAppComponent
}

/**
 * Top-level sample UI: initializes SDK services, fetches user configuration, connects WebSockets,
 * then displays {@link MainScreen}.
 */
export function RootContent({ clientAppComponent }: RootContentProps): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(clientAppComponent.isInitialized)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      clientAppComponent.init()
      await clientAppComponent.refreshUserConfigurationUseCase.execute()
      clientAppComponent.commonComponent.webSocketService.connect()
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
  }, [clientAppComponent, isInitialized])

  const loginDependencies: ClientLoginRootStoreDependencies = useMemo(
    () => ({
      appType: AppType.CLIENT,
      getOpenGlobalSettingsUseCase: clientAppComponent.settingsComponent.getOpenGlobalSettingsUseCase,
      getAvailableUserAuthProvidersUseCase: clientAppComponent.clientUserComponent.getAvailableUserAuthProvidersUseCase,
      loginByGoogleUseCase: clientAppComponent.clientUserComponent.loginByGoogleUseCase,
      loginByEmailUseCase: clientAppComponent.clientUserComponent.loginByEmailUseCase,
      loginRepository: clientAppComponent.clientUserComponent.loginRepository,
      sendLoginConfirmationToPhoneUseCase: clientAppComponent.clientUserComponent.sendLoginConfirmationToPhoneUseCase,
      loginByPhoneUseCase: clientAppComponent.clientUserComponent.loginByPhoneUseCase,
      registrationRepository: clientAppComponent.clientUserComponent.registrationRepository,
      sendRegistrationConfirmationToEmailUseCase: clientAppComponent.clientUserComponent.sendRegistrationConfirmationToEmailUseCase,
      registrationByEmailUseCase: clientAppComponent.clientUserComponent.registrationByEmailUseCase,
      resetPasswordRepository: clientAppComponent.clientUserComponent.resetPasswordRepository,
      sendResetPasswordConfirmationToEmailUseCase: clientAppComponent.clientUserComponent.sendResetPasswordConfirmationToEmailUseCase,
      resetEmailPasswordUseCase: clientAppComponent.clientUserComponent.resetEmailPasswordUseCase,
      validatePasswordUseCase: clientAppComponent.securityComponent.validatePasswordUseCase,
      loginByTotpUseCase: clientAppComponent.clientUserComponent.loginByTotpUseCase,
      loginByTotpRecoveryCodeUseCase: clientAppComponent.clientUserComponent.loginByTotpRecoveryCodeUseCase,
      restoreUserUseCase: clientAppComponent.clientUserComponent.restoreUserUseCase,
      logoutUseCase: clientAppComponent.clientUserComponent.logoutUseCase,
      getUserIdentifiersUseCase: clientAppComponent.clientUserComponent.getUserIdentifiersUseCase,
      unlockByGoogleUseCase: clientAppComponent.clientUserComponent.unlockByGoogleUseCase,
      sendUnlockEmailConfirmationUseCase: clientAppComponent.clientUserComponent.sendUnlockEmailConfirmationUseCase,
      sendUnlockPhoneConfirmationUseCase: clientAppComponent.clientUserComponent.sendUnlockPhoneConfirmationUseCase,
      unlockByEmailUseCase: clientAppComponent.clientUserComponent.unlockByEmailUseCase,
      unlockByPhoneUseCase: clientAppComponent.clientUserComponent.unlockByPhoneUseCase,
      externalLauncher: clientAppComponent.commonComponent.externalLauncher,
      onDismiss: () => void router.navigate({ to: '/profile', replace: true }),
      onFinished: () => void router.navigate({ to: '/profile', replace: true })
    }),
    [clientAppComponent]
  )

  if (!isInitialized) {
    return <InitialLoader />
  }

  return (
    <SdkProvider component={clientAppComponent.commonComponent}>
      <ClientAppComponentProvider component={clientAppComponent}>
        <ThemeProvider>
          <RouterProvider
            router={router}
            context={{
              appComponent: clientAppComponent,
              loginDependencies
            }}
          />
        </ThemeProvider>
      </ClientAppComponentProvider>
    </SdkProvider>
  )
}
