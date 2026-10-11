import { createFileRoute } from '@tanstack/react-router'
import { UserDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/users/$userId/')({
  component: function UserDetailRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { userId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!managementDeps) {
      return null
    }

    return (
      <UserDetailScreen
        dependencies={{
          userId: toUserIdOrThrow(userId),
          getUserUseCase: managementDeps.getUserUseCase,
          updateUserUseCase: managementDeps.updateUserUseCase,
          deleteUserUseCase: managementDeps.deleteUserUseCase,
          managementDisableTotpUseCase: managementDeps.managementDisableTotpUseCase,
          onNavigateToSessions: (uid) =>
            navigate({ to: '/management/users/$userId/sessions', params: { userId: uid } }),
          onNavigateToIdentifiers: (uid) =>
            navigate({ to: '/management/users/$userId/identifiers', params: { userId: uid } }),
          onNavigateToAuditEvents: (uid) =>
            navigate({ to: '/management/audit-events', search: { actorIds: [uid] } }),
          onBack: () => navigateUp({ to: '/management/users' })
        }}
      />
    )
  }
})
