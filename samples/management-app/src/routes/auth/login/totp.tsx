import { createFileRoute } from '@tanstack/react-router'
import { ManagementAuthNavigation, ManagementMainNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByTotpScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'
import { z } from 'zod'

const searchSchema = z.object({
  mfaToken: z.string().optional()
})

/** Route configuration for TOTP MFA login screen. */
export const Route = createFileRoute('/auth/login/totp')({
  validateSearch: searchSchema,
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ManagementLoginByTotpRoute() {
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
              loginByTotpUseCase: appComponent.managementUserComponent.loginByTotpUseCase,
              loginByTotpRecoveryCodeUseCase: appComponent.managementUserComponent.loginByTotpRecoveryCodeUseCase,
              onNavigateToPendingDeletion: () => {},
              onBack: () => navigateUp({ to: ManagementAuthNavigation.Main.ROUTE }),
              onFinished: () => void navigate({ to: ManagementMainNavigation.Main.route, replace: true })
            }}
          />
        </div>
      </div>
    )
  }
})
