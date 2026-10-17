import { createFileRoute } from '@tanstack/react-router'
import { AppType, ManagementAuthNavigation, ManagementMainNavigation, type AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByEmailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for login by email screen. */
export const Route = createFileRoute('/auth/login/email')({
  beforeLoad: () => {
    // Auth guard is handled at RootContent level for management app
  },
  component: function ManagementLoginByEmailRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <LoginByEmailScreen
            dependencies={{
              appType: AppType.MANAGEMENT,
              loginByEmailUseCase: appComponent.managementUserComponent.loginByEmailUseCase,
              onNavigateToRegistrationByEmail: () => {},
              onNavigateToForgotPassword: () => void navigate({ to: ManagementAuthNavigation.ResetPassword.ROUTE }),
              onNavigateToTotp: (mfaToken: string) => void navigate({ to: ManagementAuthNavigation.LoginByTotp.ROUTE, search: { mfaToken } }),
              onNavigateToPendingDeletion: () => {},
              onNavigateToAccountUnlock: (lockoutType?: AccountLockoutType | null, lockoutUntil?: number | null) =>
                void navigate({ to: ManagementAuthNavigation.UnlockMethodSelection.ROUTE, search: { lockoutType: lockoutType ?? undefined, lockoutUntil: lockoutUntil ?? undefined } }),
              onBack: () => navigateUp({ to: ManagementAuthNavigation.Main.ROUTE }),
              onFinished: () => void navigate({ to: ManagementMainNavigation.Main.route, replace: true })
            }}
          />
        </div>
      </div>
    )
  }
})
