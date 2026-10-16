import { createFileRoute } from '@tanstack/react-router'
import { ClientAuthNavigation, ClientUserNavigation, type AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import { LoginWelcomeScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const Route = createFileRoute('/auth/login/')({
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ClientLoginWelcomeRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <LoginWelcomeScreen
            dependencies={{
              externalLauncher: appComponent.commonComponent.externalLauncher,
              getOpenGlobalSettingsUseCase: appComponent.settingsComponent.getOpenGlobalSettingsUseCase,
              getAvailableUserAuthProvidersUseCase: appComponent.clientUserComponent.getAvailableUserAuthProvidersUseCase,
              loginByGoogleUseCase: appComponent.clientUserComponent.loginByGoogleUseCase,
              onNavigateToLoginByEmail: () => void navigate({ to: ClientAuthNavigation.LoginByEmail.ROUTE }),
              onNavigateToLoginByPhone: () => void navigate({ to: ClientAuthNavigation.LoginByPhone.ROUTE }),
              onNavigateToTotp: (mfaToken: string) => void navigate({ to: ClientAuthNavigation.LoginByTotp.ROUTE, search: { mfaToken } }),
              onNavigateToPendingDeletion: () => void navigate({ to: ClientAuthNavigation.PendingDeletion.ROUTE }),
              onNavigateToAccountUnlock: (lockoutType?: AccountLockoutType | null, lockoutUntil?: number | null) =>
                void navigate({ to: ClientAuthNavigation.UnlockMethodSelection.ROUTE, search: { lockoutType: lockoutType ?? undefined, lockoutUntil: lockoutUntil ?? undefined } }),
              onFinished: () => void navigate({ to: ClientUserNavigation.Main.route, replace: true })
            }}
          />
        </div>
      </div>
    )
  }
})
