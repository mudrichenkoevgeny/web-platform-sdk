import { createFileRoute } from '@tanstack/react-router'
import { ClientAuthNavigation, ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByTotpScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'
import { z } from 'zod'

const searchSchema = z.object({
  mfaToken: z.string().optional()
})

export const Route = createFileRoute('/auth/login/totp')({
  validateSearch: searchSchema,
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ClientLoginByTotpRoute() {
    const { appComponent } = Route.useRouteContext()
    const { mfaToken } = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <LoginByTotpScreen
            dependencies={{
              mfaToken: mfaToken ?? '',
              loginByTotpUseCase: appComponent.clientUserComponent.loginByTotpUseCase,
              loginByTotpRecoveryCodeUseCase: appComponent.clientUserComponent.loginByTotpRecoveryCodeUseCase,
              onNavigateToPendingDeletion: () => void navigate({ to: ClientAuthNavigation.PendingDeletion.ROUTE }),
              onBack: () => navigateUp({ to: ClientAuthNavigation.Main.ROUTE }),
              onFinished: () => void navigate({ to: ClientUserNavigation.Main.route, replace: true })
            }}
          />
        </div>
      </div>
    )
  }
})
