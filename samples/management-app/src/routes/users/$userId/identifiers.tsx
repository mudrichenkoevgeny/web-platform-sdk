import { createFileRoute } from '@tanstack/react-router'
import { IdentifierListScreen, createManagementIdentifierListDataSource } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
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
      <IdentifierListScreen
        dependencies={{
          userId: toUserIdOrThrow(userId),
          dataSource: createManagementIdentifierListDataSource({
            managementGetIdentifiersUseCase: managementDeps.managementGetIdentifiersUseCase
          }),
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: newParams as Record<string, unknown>, replace: true }),
          onIdentifierSelect: (identifierId) =>
            void navigate({ to: '/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => void navigateUp({ to: '/users/$userId', params: { userId } })
        }}
      />
    )
  }
})
