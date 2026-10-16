import { createFileRoute } from '@tanstack/react-router'
import { ClientAuthNavigation, ClientUserNavigation, type AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByPhoneScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/auth/login/phone')({
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ClientLoginByPhoneRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <LoginByPhoneScreen
            dependencies={{
              loginRepository: appComponent.clientUserComponent.loginRepository,
              sendLoginConfirmationToPhoneUseCase: appComponent.clientUserComponent.sendLoginConfirmationToPhoneUseCase,
              loginByPhoneUseCase: appComponent.clientUserComponent.loginByPhoneUseCase,
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
