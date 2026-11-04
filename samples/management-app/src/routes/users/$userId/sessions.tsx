import { createFileRoute } from '@tanstack/react-router'
import { SessionListScreen, createManagementSessionListDataSource } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { managementUserSessionListParamsSchema, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for user-specific session list screen. */
export const Route = createFileRoute('/users/$userId/sessions')({
  validateSearch: (rawSearch) => parseSearchParams(managementUserSessionListParamsSchema, rawSearch),
  component: function UserSessionListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { userId } = Route.useParams()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!managementDeps) {
      return null
    }

    return (
      <SessionListScreen
        dependencies={{
          userId: toUserIdOrThrow(userId),
          dataSource: createManagementSessionListDataSource({
            managementGetSessionsUseCase: managementDeps.managementGetSessionsUseCase,
            managementDeleteSessionUseCase: managementDeps.managementDeleteSessionUseCase,
            managementDeleteAllUserSessionsUseCase: managementDeps.managementDeleteAllUserSessionsUseCase
          }),
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: newParams as Record<string, unknown>, replace: true }),
          onNavigateToSessionDetail: (session) =>
            Boolean(session.id) && void navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id! } }),
          onBack: () => void navigateUp({ to: '/users/$userId', params: { userId } })
        }}
      />
    )
  }
})
