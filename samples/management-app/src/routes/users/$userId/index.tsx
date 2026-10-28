import { createFileRoute } from '@tanstack/react-router'
import { UserDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementUsersNavigation, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for user detail screen. */
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
          currentUserId: managementDeps.currentUserId,
          getUserUseCase: managementDeps.getUserUseCase,
          updateUserUseCase: managementDeps.updateUserUseCase,
          deleteUserUseCase: managementDeps.deleteUserUseCase,
          managementDisableTotpUseCase: managementDeps.managementDisableTotpUseCase,
          onNavigateToSessions: (uid) =>
            navigate({ to: '/users/$userId/sessions', params: { userId: uid }, search: {} }),
          onNavigateToIdentifiers: (uid) =>
            navigate({ to: '/users/$userId/identifiers', params: { userId: uid }, search: {} }),
          onNavigateToAuditEvents: (uid) =>
            navigate({ to: '/audit/events', search: (prev) => ({ ...prev, actor_id: [uid] }) }),
          onNavigateToStorageFiles: (uid) =>
            navigate({ to: '/storage/files', search: { ownerUserId: uid } }),
          onBack: () => navigateUp({ to: ManagementUsersNavigation.UserList.ROUTE, search: (prev) => prev })
        }}
      />
    )
  }
})
