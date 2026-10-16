import { createFileRoute } from '@tanstack/react-router'
import { UserDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementUsersNavigation, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/users/$userId/')({
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
            navigate({ to: '/users/$userId/sessions', params: { userId: uid }, search: (prev: Record<string, unknown>) => prev }),
          onNavigateToIdentifiers: (uid) =>
            navigate({ to: '/users/$userId/identifiers', params: { userId: uid }, search: (prev: Record<string, unknown>) => prev }),
          onNavigateToAuditEvents: (uid) =>
            navigate({ to: '/audit/events', search: (prev: Record<string, unknown>) => ({ ...prev, actorIds: [uid] }) }),
          onBack: () => navigateUp({ to: ManagementUsersNavigation.UserList.ROUTE, search: (prev: Record<string, unknown>) => prev })
        }}
      />
    )
  }
})
