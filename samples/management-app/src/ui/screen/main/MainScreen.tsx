import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { AppType, type UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  ManagementLoginRootScreen,
  type ManagementLoginRootStoreDependencies
} from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import {
  MfaChallengeDialog,
  type MfaChallengeRequest
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useManagementAppComponent } from '@/di/management-app-context'
import { getDestinations, type MainTabKey } from '@/ui/screen/main/main-screen-destination'

/**
 * Sample main shell for management app: sidebar navigation, tab content (home, profile, settings),
 * and login / MFA challenge dialog overlays.
 */
export function MainScreen(): React.JSX.Element {
  const appComponent = useManagementAppComponent()
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mfaRequest, setMfaRequest] = useState<MfaChallengeRequest | null>(null)

  const activeTab: MainTabKey = useMemo(() => {
    if (location.pathname.startsWith('/management')) {
      return 'settings'
    }
    return 'home'
  }, [location.pathname])

  useEffect(() => {
    return appComponent.managementUserComponent.selfManagementUserRepository.observeCurrentUser((user: UserPrivate | null) => {
      const authorized = user !== null
      setIsAuthorized(authorized)
      if (!authorized && location.pathname.startsWith('/management')) {
        void navigate({ to: '/', replace: true })
      }
    })
  }, [appComponent, location.pathname, navigate])

  useEffect(() => {
    return appComponent.mfaChallengeHandler.subscribe((req) => {
      setMfaRequest(req)
    })
  }, [appComponent])

  const destinations = useMemo(() => getDestinations(isAuthorized), [isAuthorized])

  const loginDependencies: ManagementLoginRootStoreDependencies = useMemo(
    () => ({
      appType: AppType.MANAGEMENT,
      getOpenGlobalSettingsUseCase: appComponent.settingsComponent.getOpenGlobalSettingsUseCase,
      getAvailableUserAuthProvidersUseCase: appComponent.managementUserComponent.getAvailableUserAuthProvidersUseCase,
      loginByEmailUseCase: appComponent.managementUserComponent.loginByEmailUseCase,
      resetPasswordRepository: appComponent.managementUserComponent.selfManagementResetPasswordRepository,
      sendResetPasswordConfirmationToEmailUseCase: appComponent.managementUserComponent.sendResetPasswordConfirmationToEmailUseCase,
      resetEmailPasswordUseCase: appComponent.managementUserComponent.resetEmailPasswordUseCase,
      validatePasswordUseCase: appComponent.securityComponent.validatePasswordUseCase,
      loginByTotpUseCase: appComponent.managementUserComponent.loginByTotpUseCase,
      loginByTotpRecoveryCodeUseCase: appComponent.managementUserComponent.loginByTotpRecoveryCodeUseCase,
      restoreUserUseCase: appComponent.managementUserComponent.restoreUserUseCase,
      logoutUseCase: appComponent.managementUserComponent.logoutUseCase,
      getUserIdentifiersUseCase: appComponent.managementUserComponent.getUserIdentifiersUseCase,
      sendUnlockEmailConfirmationUseCase: appComponent.managementUserComponent.sendUnlockEmailConfirmationUseCase,
      sendUnlockPhoneConfirmationUseCase: appComponent.managementUserComponent.sendUnlockPhoneConfirmationUseCase,
      unlockByEmailUseCase: appComponent.managementUserComponent.unlockByEmailUseCase,
      unlockByPhoneUseCase: appComponent.managementUserComponent.unlockByPhoneUseCase,
      externalLauncher: appComponent.commonComponent.externalLauncher,
      onDismiss: () => setIsLoginOpen(false),
      onFinished: () => setIsLoginOpen(false)
    }),
    [appComponent]
  )

  const handleTabClick = (tabKey: MainTabKey) => {
    if (tabKey === 'settings' && !isAuthorized) {
      return
    }
    if (tabKey === 'home') {
      void navigate({ to: '/', replace: true })
    } else if (tabKey === 'settings' || tabKey === 'profile') {
      void navigate({ to: '/management', replace: true })
    }
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      {/* Navigation Bar / Rail */}
      <nav className="w-full md:w-64 md:h-full border-r border-border bg-card p-4 flex md:flex-col justify-between items-center md:items-start gap-4">
        <div className="flex md:flex-col w-full gap-2">
          {destinations.map((dest) => {
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

      {/* Screen Content Area */}
      <main className="flex-1 h-full overflow-auto relative">
        <Outlet />
      </main>

      {/* Login Dialog Overlay */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
            <ManagementLoginRootScreen dependencies={loginDependencies} />
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
