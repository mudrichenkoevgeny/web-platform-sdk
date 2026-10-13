import { createFileRoute } from '@tanstack/react-router'
import { SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/profile/sessions/$sessionId')({
  component: function ProfileSessionDetailRoute() {
    const { appComponent } = Route.useRouteContext()
    const { sessionId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <SessionDetailScreen
        dependencies={{
          sessionId: toUserSessionIdOrThrow(sessionId),
          getSessionUseCase: appComponent.managementUserComponent.getSessionUseCase,
          deleteSessionUseCase: appComponent.managementUserComponent.deleteSessionUseCase,
          authStorage: appComponent.managementUserComponent.authStorage,
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/management/profile/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToProfile: () => navigate({ to: '/management/profile' }),
          onNavigateToUserDetail: () => navigate({ to: '/management/profile' }),
          onBack: () => navigateUp({ to: '/management/profile/sessions' })
        }}
      />
    )
  }
})
