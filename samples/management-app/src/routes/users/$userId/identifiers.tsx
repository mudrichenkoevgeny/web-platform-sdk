import { createFileRoute } from '@tanstack/react-router'
import { UserIdentifierListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { managementUserIdentifierListParamsSchema, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for user-specific identifier list screen. */
export const Route = createFileRoute('/users/$userId/identifiers')({
  validateSearch: (rawSearch) => parseSearchParams(managementUserIdentifierListParamsSchema, rawSearch),
  component: function UserIdentifierListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { userId } = Route.useParams()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!managementDeps) {
      return null
    }

    return (
      <UserIdentifierListScreen
        dependencies={{
          userId: toUserIdOrThrow(userId),
          managementGetIdentifiersUseCase: managementDeps.managementGetIdentifiersUseCase,
          currentUserId: managementDeps.currentUserId,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }), replace: true }),
          onIdentifierSelect: (identifierId) =>
            navigate({ to: '/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigateUp({ to: '/users/$userId', params: { userId } })
        }}
      />
    )
  }
})
