import { createFileRoute } from '@tanstack/react-router'
import { ManagementAuthNavigation, ManagementMainNavigation, type AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import { LoginWelcomeScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const Route = createFileRoute('/auth/login/')({
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ManagementLoginWelcomeRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <LoginWelcomeScreen
            dependencies={{
              externalLauncher: appComponent.commonComponent.externalLauncher,
              getOpenGlobalSettingsUseCase: appComponent.settingsComponent.getOpenGlobalSettingsUseCase,
              getAvailableUserAuthProvidersUseCase: appComponent.managementUserComponent.getAvailableUserAuthProvidersUseCase,
              loginByGoogleUseCase: null,
              onNavigateToLoginByEmail: () => void navigate({ to: ManagementAuthNavigation.LoginByEmail.ROUTE }),
              onNavigateToLoginByPhone: () => {},
              onNavigateToTotp: (mfaToken: string) => void navigate({ to: ManagementAuthNavigation.LoginByTotp.ROUTE, search: { mfaToken } }),
              onNavigateToPendingDeletion: () => {},
              onNavigateToAccountUnlock: (lockoutType?: AccountLockoutType | null, lockoutUntil?: number | null) =>
                void navigate({ to: ManagementAuthNavigation.UnlockMethodSelection.ROUTE, search: { lockoutType: lockoutType ?? undefined, lockoutUntil: lockoutUntil ?? undefined } }),
              onFinished: () => void navigate({ to: ManagementMainNavigation.Main.route, replace: true })
            }}
          />
        </div>
      </div>
    )
  }
})
