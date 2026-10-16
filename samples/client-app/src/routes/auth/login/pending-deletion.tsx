import { createFileRoute } from '@tanstack/react-router'
import { ClientAuthNavigation, ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { PendingDeletionScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/auth/login/pending-deletion')({
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ClientPendingDeletionRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <PendingDeletionScreen
            dependencies={{
              restoreUserUseCase: appComponent.clientUserComponent.restoreUserUseCase,
              logoutUseCase: appComponent.clientUserComponent.logoutUseCase,
              onRestoreSuccess: () => void navigate({ to: ClientUserNavigation.Main.route, replace: true }),
              onSignOut: () => navigateUp({ to: ClientAuthNavigation.Main.ROUTE })
            }}
          />
        </div>
      </div>
    )
  }
})
