import { createFileRoute } from '@tanstack/react-router'
import { AppType, ClientAuthNavigation, ClientUserNavigation, type AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByEmailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/auth/login/email')({
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ClientLoginByEmailRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <LoginByEmailScreen
            dependencies={{
              appType: AppType.CLIENT,
              loginByEmailUseCase: appComponent.clientUserComponent.loginByEmailUseCase,
              onNavigateToRegistrationByEmail: () => void navigate({ to: ClientAuthNavigation.Registration.ROUTE }),
              onNavigateToForgotPassword: () => void navigate({ to: ClientAuthNavigation.ResetPassword.ROUTE }),
              onNavigateToTotp: (mfaToken: string) => void navigate({ to: ClientAuthNavigation.LoginByTotp.ROUTE, search: { mfaToken } }),
              onNavigateToPendingDeletion: () => void navigate({ to: ClientAuthNavigation.PendingDeletion.ROUTE }),
              onNavigateToAccountUnlock: (lockoutType?: AccountLockoutType | null, lockoutUntil?: number | null) =>
                void navigate({ to: ClientAuthNavigation.UnlockMethodSelection.ROUTE, search: { lockoutType: lockoutType ?? undefined, lockoutUntil: lockoutUntil ?? undefined } }),
              onBack: () => navigateUp({ to: ClientAuthNavigation.Main.ROUTE }),
              onFinished: () => void navigate({ to: ClientUserNavigation.Main.route, replace: true })
            }}
          />
        </div>
      </div>
    )
  }
})
