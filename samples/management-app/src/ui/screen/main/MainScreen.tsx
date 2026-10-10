import React, { useEffect, useMemo, useState } from 'react'
import { AppType, type UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  ManagementLoginRootScreen,
  type ManagementLoginRootStoreDependencies,
  ManagementRootScreen,
  type ManagementRootStoreDependencies
} from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import {
  IdentifierDetailScreen,
  MainProfileScreen,
  type MainProfileStoreDependencies,
  MfaChallengeDialog,
  type MfaChallengeRequest,
  type ProfileDestination,
  SelfIdentifierListScreen,
  SelfSessionListScreen,
  SessionDetailScreen,
  TotpMainScreen,
  TotpRecoveryCodesScreen
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useManagementAppComponent } from '@/di/management-app-context'
import { HomeScreen } from '@/ui/screen/home/HomeScreen'
import { getDestinations, type MainTabKey } from '@/ui/screen/main/main-screen-destination'
import { useHashRouter } from '@/ui/root/use-hash-router'

/**
 * Sample main shell for management app: sidebar navigation, tab content (home, profile, settings),
 * and login / MFA challenge dialog overlays.
 */
export function MainScreen(): React.JSX.Element {
  const appComponent = useManagementAppComponent()
  const [activeTab, setActiveTab] = useState<MainTabKey>('home')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mfaRequest, setMfaRequest] = useState<MfaChallengeRequest | null>(null)
  const [profileStack, setProfileStack] = useState<ProfileDestination[]>([{ type: 'main' }])

  useHashRouter(activeTab, setActiveTab)

  useEffect(() => {
    return appComponent.managementUserComponent.selfManagementUserRepository.observeCurrentUser((user: UserPrivate | null) => {
      const authorized = user !== null
      setIsAuthorized(authorized)
      if (!authorized && activeTab === 'settings') {
        setActiveTab('home')
      }
    })
  }, [appComponent, activeTab])

  useEffect(() => {
    return appComponent.mfaChallengeHandler.subscribe((req) => {
      setMfaRequest(req)
    })
  }, [appComponent])

  const popProfile = () => setProfileStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  const pushProfile = (dest: ProfileDestination) => setProfileStack((prev) => [...prev, dest])

  const currentProfileDest = profileStack[profileStack.length - 1] ?? { type: 'main' }

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

  const profileDependencies: MainProfileStoreDependencies = useMemo(
    () => ({
      appType: AppType.MANAGEMENT,
      userRepository: appComponent.managementUserComponent.selfUserRepository,
      logoutUseCase: appComponent.managementUserComponent.logoutUseCase,
      scheduleUserDeletionUseCase: appComponent.managementUserComponent.scheduleUserDeletionUseCase,
      onNavigateToLogin: () => setIsLoginOpen(true),
      onNavigateToTotp: () => pushProfile({ type: 'totpMain' }),
      onNavigateToSessions: () => pushProfile({ type: 'sessions' }),
      onNavigateToIdentifiers: () => pushProfile({ type: 'identifiers' })
    }),
    [appComponent]
  )

  const managementDependencies: ManagementRootStoreDependencies = useMemo(
    () => ({
      getManagementAuthSettingsUseCase: appComponent.managementUserComponent.getManagementAuthSettingsUseCase,
      saveRemoteAuthSettingsUseCase: appComponent.managementUserComponent.saveRemoteAuthSettingsUseCase,
      resetRemoteAuthSettingsUseCase: appComponent.managementUserComponent.resetRemoteAuthSettingsUseCase,
      getManagementGlobalSettingsUseCase: appComponent.managementUserComponent.getManagementGlobalSettingsUseCase,
      saveRemoteGlobalSettingsUseCase: appComponent.managementUserComponent.saveRemoteGlobalSettingsUseCase,
      resetRemoteGlobalSettingsUseCase: appComponent.managementUserComponent.resetRemoteGlobalSettingsUseCase,
      getManagementSecuritySettingsUseCase: appComponent.managementUserComponent.getManagementSecuritySettingsUseCase,
      saveRemoteSecuritySettingsUseCase: appComponent.managementUserComponent.saveRemoteSecuritySettingsUseCase,
      resetRemoteSecuritySettingsUseCase: appComponent.managementUserComponent.resetRemoteSecuritySettingsUseCase,
      getUsersUseCase: appComponent.managementUserComponent.getUsersUseCase,
      getUserUseCase: appComponent.managementUserComponent.getUserUseCase,
      createUserUseCase: appComponent.managementUserComponent.createUserUseCase,
      updateUserUseCase: appComponent.managementUserComponent.updateUserUseCase,
      deleteUserUseCase: appComponent.managementUserComponent.deleteUserUseCase,
      managementGetSessionsUseCase: appComponent.managementUserComponent.managementGetSessionsUseCase,
      managementGetSessionUseCase: appComponent.managementUserComponent.managementGetSessionUseCase,
      managementGetIdentifiersUseCase: appComponent.managementUserComponent.managementGetIdentifiersUseCase,
      managementGetIdentifierUseCase: appComponent.managementUserComponent.managementGetIdentifierUseCase,
      managementDisableTotpUseCase: appComponent.managementUserComponent.managementDisableTotpUseCase,
      managementDeleteSessionUseCase: appComponent.managementUserComponent.managementDeleteSessionUseCase,
      managementDeleteAllUserSessionsUseCase: appComponent.managementUserComponent.managementDeleteAllUserSessionsUseCase,
      managementDeleteIdentifierUseCase: appComponent.managementUserComponent.managementDeleteIdentifierUseCase,
      managementDeleteIdentifierPasswordUseCase: appComponent.managementUserComponent.managementDeleteIdentifierPasswordUseCase,
      getAuditEventsUseCase: appComponent.managementUserComponent.getAuditEventsUseCase,
      getAuditEventUseCase: appComponent.managementUserComponent.getAuditEventUseCase,
      selfManagementUserRepository: appComponent.managementUserComponent.selfManagementUserRepository,
      onNavigateToProfile: () => setActiveTab('profile')
    }),
    [appComponent]
  )

  const handleTabClick = (tabKey: MainTabKey) => {
    if (tabKey === 'settings' && !isAuthorized) {
      return
    }
    setActiveTab(tabKey)
  }

  const renderProfileScreen = () => {
    switch (currentProfileDest.type) {
      case 'main':
        return <MainProfileScreen dependencies={profileDependencies} />
      case 'totpMain':
        return (
          <TotpMainScreen
            dependencies={{
              userRepository: appComponent.managementUserComponent.selfUserRepository,
              setupTotpUseCase: appComponent.managementUserComponent.setupTotpUseCase,
              enableTotpUseCase: appComponent.managementUserComponent.enableTotpUseCase,
              disableTotpUseCase: appComponent.managementUserComponent.disableTotpUseCase,
              onNavigateToRecoveryCodes: () => pushProfile({ type: 'totpRecoveryCodes' }),
              onBack: popProfile
            }}
          />
        )
      case 'totpRecoveryCodes':
        return (
          <TotpRecoveryCodesScreen
            dependencies={{
              getRecoveryCodesUseCase: appComponent.managementUserComponent.getRecoveryCodesUseCase,
              regenerateRecoveryCodesUseCase: appComponent.managementUserComponent.regenerateRecoveryCodesUseCase,
              onBack: popProfile
            }}
          />
        )
      case 'sessions':
        return (
          <SelfSessionListScreen
            dependencies={{
              getSessionsUseCase: appComponent.managementUserComponent.getSessionsUseCase,
              deleteSessionUseCase: appComponent.managementUserComponent.deleteSessionUseCase,
              deleteAllOtherSessionsUseCase: appComponent.managementUserComponent.deleteAllOtherSessionsUseCase,
              authStorage: appComponent.managementUserComponent.authStorage,
              onNavigateToSessionDetail: (session) =>
                pushProfile({ type: 'sessionDetail', sessionId: session.id }),
              onBack: popProfile
            }}
          />
        )
      case 'sessionDetail':
        return (
          <SessionDetailScreen
            dependencies={{
              sessionId: currentProfileDest.sessionId,
              getSessionUseCase: appComponent.managementUserComponent.getSessionUseCase,
              deleteSessionUseCase: appComponent.managementUserComponent.deleteSessionUseCase,
              authStorage: appComponent.managementUserComponent.authStorage,
              onNavigateToIdentifierDetail: (identifierId) =>
                pushProfile({ type: 'identifierDetail', identifierId }),
              onNavigateToProfile: () => setProfileStack([{ type: 'main' }]),
              onNavigateToUserDetail: () => setProfileStack([{ type: 'main' }]),
              onBack: popProfile
            }}
          />
        )
      case 'identifiers':
        return (
          <SelfIdentifierListScreen
            dependencies={{
              appType: AppType.MANAGEMENT,
              getUserIdentifiersUseCase: appComponent.managementUserComponent.getUserIdentifiersUseCase,
              getAvailableUserAuthProvidersUseCase:
                appComponent.managementUserComponent.getAvailableUserAuthProvidersUseCase,
              sendAddEmailIdentifierConfirmationUseCase:
                appComponent.managementUserComponent.sendAddEmailIdentifierConfirmationUseCase,
              addUserIdentifierEmailUseCase:
                appComponent.managementUserComponent.addUserIdentifierEmailUseCase,
              sendAddPhoneIdentifierConfirmationUseCase:
                appComponent.managementUserComponent.sendAddPhoneIdentifierConfirmationUseCase,
              addUserIdentifierPhoneUseCase:
                appComponent.managementUserComponent.addUserIdentifierPhoneUseCase,
              addUserIdentifierGoogleUseCase:
                appComponent.managementUserComponent.addUserIdentifierGoogleUseCase,
              authStorage: appComponent.managementUserComponent.authStorage,
              onIdentifierSelect: (identifierId) =>
                pushProfile({ type: 'identifierDetail', identifierId }),
              onBack: popProfile
            }}
          />
        )
      case 'identifierDetail':
        return (
          <IdentifierDetailScreen
            dependencies={{
              identifierId: currentProfileDest.identifierId,
              getUserIdentifierUseCase: appComponent.managementUserComponent.getUserIdentifierUseCase,
              deleteUserIdentifierUseCase:
                appComponent.managementUserComponent.deleteUserIdentifierUseCase,
              emailChangePasswordUseCase:
                appComponent.managementUserComponent.emailChangePasswordUseCase,
              authStorage: appComponent.managementUserComponent.authStorage,
              onNavigateToProfile: () => setProfileStack([{ type: 'main' }]),
              onNavigateToUserDetail: () => setProfileStack([{ type: 'main' }]),
              onBack: popProfile
            }}
          />
        )
      default:
        return <MainProfileScreen dependencies={profileDependencies} />
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
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'profile' && renderProfileScreen()}
        {activeTab === 'settings' && isAuthorized && (
          <ManagementRootScreen dependencies={managementDependencies} />
        )}
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
