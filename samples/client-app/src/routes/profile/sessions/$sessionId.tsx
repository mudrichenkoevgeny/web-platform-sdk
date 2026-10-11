import { createFileRoute } from '@tanstack/react-router'
import { SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/profile/sessions/$sessionId')({
  component: function ProfileSessionDetailRoute() {
    const { appComponent } = Route.useRouteContext()
    const { sessionId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    return (
      <SessionDetailScreen
        dependencies={{
          sessionId: sessionId as UserSessionId,
          getSessionUseCase: appComponent.clientUserComponent.getSessionUseCase,
          deleteSessionUseCase: appComponent.clientUserComponent.deleteSessionUseCase,
          authStorage: appComponent.clientUserComponent.authStorage,
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/profile/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToProfile: () => navigate({ to: '/profile' }),
          onNavigateToUserDetail: () => navigate({ to: '/profile' }),
          onBack: () => navigateUp({ to: '/profile/sessions' })
        }}
      />
    )
  }
})
