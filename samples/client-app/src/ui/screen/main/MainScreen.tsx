import React, { useEffect, useMemo, useState } from 'react'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  ClientLoginRootScreen,
  type ClientLoginRootStoreDependencies
} from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import {
  MainProfileScreen,
  type MainProfileStoreDependencies,
  MfaChallengeDialog,
  type MfaChallengeRequest
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useClientAppComponent } from '@/di/client-app-context'
import { HomeScreen } from '@/ui/screen/home/HomeScreen'
import { mainScreenDestinations, type MainTabKey } from '@/ui/screen/main/main-screen-destination'
import { useHashRouter } from '@/ui/root/use-hash-router'

/**
 * Sample main shell with navigation tabs, Decompose-style stack view, and login / MFA dialog overlays.
 */
export function MainScreen(): React.JSX.Element {
  const appComponent = useClientAppComponent()
  const [activeTab, setActiveTab] = useState<MainTabKey>('home')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mfaRequest, setMfaRequest] = useState<MfaChallengeRequest | null>(null)

  useHashRouter(activeTab, setActiveTab)

  useEffect(() => {
    return appComponent.mfaChallengeHandler.subscribe((req) => {
      setMfaRequest(req)
    })
  }, [appComponent])

  const loginDependencies: ClientLoginRootStoreDependencies = useMemo(
    () => ({
      appType: AppType.CLIENT,
      getOpenGlobalSettingsUseCase: appComponent.settingsComponent.getOpenGlobalSettingsUseCase,
      getAvailableUserAuthProvidersUseCase: appComponent.clientUserComponent.getAvailableUserAuthProvidersUseCase,
      loginByGoogleUseCase: appComponent.clientUserComponent.loginByGoogleUseCase,
      loginByEmailUseCase: appComponent.clientUserComponent.loginByEmailUseCase,
      loginRepository: appComponent.clientUserComponent.loginRepository,
      sendLoginConfirmationToPhoneUseCase: appComponent.clientUserComponent.sendLoginConfirmationToPhoneUseCase,
      loginByPhoneUseCase: appComponent.clientUserComponent.loginByPhoneUseCase,
      registrationRepository: appComponent.clientUserComponent.registrationRepository,
      sendRegistrationConfirmationToEmailUseCase: appComponent.clientUserComponent.sendRegistrationConfirmationToEmailUseCase,
      registrationByEmailUseCase: appComponent.clientUserComponent.registrationByEmailUseCase,
      resetPasswordRepository: appComponent.clientUserComponent.resetPasswordRepository,
      sendResetPasswordConfirmationToEmailUseCase: appComponent.clientUserComponent.sendResetPasswordConfirmationToEmailUseCase,
      resetEmailPasswordUseCase: appComponent.clientUserComponent.resetEmailPasswordUseCase,
      validatePasswordUseCase: appComponent.securityComponent.validatePasswordUseCase,
      loginByTotpUseCase: appComponent.clientUserComponent.loginByTotpUseCase,
      loginByTotpRecoveryCodeUseCase: appComponent.clientUserComponent.loginByTotpRecoveryCodeUseCase,
      restoreUserUseCase: appComponent.clientUserComponent.restoreUserUseCase,
      logoutUseCase: appComponent.clientUserComponent.logoutUseCase,
      getUserIdentifiersUseCase: appComponent.clientUserComponent.getUserIdentifiersUseCase,
      unlockByGoogleUseCase: appComponent.clientUserComponent.unlockByGoogleUseCase,
      sendUnlockEmailConfirmationUseCase: appComponent.clientUserComponent.sendUnlockEmailConfirmationUseCase,
      sendUnlockPhoneConfirmationUseCase: appComponent.clientUserComponent.sendUnlockPhoneConfirmationUseCase,
      unlockByEmailUseCase: appComponent.clientUserComponent.unlockByEmailUseCase,
      unlockByPhoneUseCase: appComponent.clientUserComponent.unlockByPhoneUseCase,
      externalLauncher: appComponent.commonComponent.externalLauncher,
      onDismiss: () => setIsLoginOpen(false),
      onFinished: () => setIsLoginOpen(false)
    }),
    [appComponent]
  )

  const profileDependencies: MainProfileStoreDependencies = useMemo(
    () => ({
      appType: AppType.CLIENT,
      userRepository: appComponent.clientUserComponent.userRepository,
      logoutUseCase: appComponent.clientUserComponent.logoutUseCase,
      scheduleUserDeletionUseCase: appComponent.clientUserComponent.scheduleUserDeletionUseCase,
      getAuthSettingsUseCase: appComponent.clientUserComponent.getAuthSettingsUseCase,
      observeAuthSettingsUseCase: appComponent.clientUserComponent.observeAuthSettingsUseCase,
      onNavigateToLogin: () => setIsLoginOpen(true),
      onNavigateToTotp: () => {},
      onNavigateToSessions: () => {},
      onNavigateToIdentifiers: () => {}
    }),
    [appComponent]
  )

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      {/* Navigation Bar / Rail */}
      <nav className="w-full md:w-64 md:h-full border-r border-border bg-card p-4 flex md:flex-col justify-between items-center md:items-start gap-4">
        <div className="flex md:flex-col w-full gap-2">
          {mainScreenDestinations.map((dest) => {
            const isActive = activeTab === dest.key
            return (
              <button
                key={dest.key}
                type="button"
                onClick={() => setActiveTab(dest.key)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <CoreIcon src={dest.Icon} className="w-5 h-5" />
                <span>{dest.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Screen Content Area */}
      <main className="flex-1 h-full overflow-auto relative">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'profile' && <MainProfileScreen dependencies={profileDependencies} />}
      </main>

      {/* Login Dialog Overlay */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
            <ClientLoginRootScreen dependencies={loginDependencies} />
          </div>
        </div>
      )}

      {/* MFA Challenge Dialog Overlay */}
      {mfaRequest && (
        <MfaChallengeDialog
          request={mfaRequest}
          onConfirm={(code) => appComponent.mfaChallengeHandler.onConfirm(code)}
          onCancel={() => appComponent.mfaChallengeHandler.onCancel()}
        />
      )}
    </div>
  )
}
