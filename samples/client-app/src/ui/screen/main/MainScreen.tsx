import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  ClientLoginRootScreen,
  type ClientLoginRootStoreDependencies
} from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import {
  MfaChallengeDialog,
  type MfaChallengeRequest
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useClientAppComponent } from '@/di/client-app-context'
import { mainScreenDestinations, type MainTabKey } from '@/ui/screen/main/main-screen-destination'

export function MainScreen(): React.JSX.Element {
  const appComponent = useClientAppComponent()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mfaRequest, setMfaRequest] = useState<MfaChallengeRequest | null>(null)

  const activeTab: MainTabKey = useMemo(() => {
    if (location.pathname.startsWith('/profile')) {
      return 'profile'
    }
    return 'home'
  }, [location.pathname])

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

  const handleTabClick = (tabKey: MainTabKey) => {
    if (tabKey === 'home') {
      void navigate({ to: '/', replace: true })
    } else if (tabKey === 'profile') {
      void navigate({ to: '/profile', replace: true })
    }
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      <nav className="w-full md:w-64 md:h-full border-r border-border bg-card p-4 flex md:flex-col justify-between items-center md:items-start gap-4">
        <div className="flex md:flex-col w-full gap-2">
          {mainScreenDestinations.map((dest) => {
            const isActive = activeTab === dest.key
            return (
              <button
                key={dest.key}
                type="button"
                onClick={() => handleTabClick(dest.key)}
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

      <main className="flex-1 h-full overflow-auto relative">
        <Outlet />
      </main>

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
            <ClientLoginRootScreen dependencies={loginDependencies} />
          </div>
        </div>
      )}

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
