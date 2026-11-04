import { createFileRoute } from '@tanstack/react-router'
import { SessionListScreen, createManagementSessionListDataSource } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementMainNavigation, managementGlobalSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for global user session list screen. */
export const Route = createFileRoute('/sessions/')({
  validateSearch: (rawSearch) => parseSearchParams(managementGlobalSessionListParamsSchema, rawSearch),
  component: function GlobalSessionListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <SessionListScreen
        includeOwnerFilter
        dependencies={{
          dataSource: createManagementSessionListDataSource({
            managementGetSessionsUseCase: managementDeps.managementGetSessionsUseCase,
            managementDeleteSessionUseCase: managementDeps.managementDeleteSessionUseCase
          }),
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: newParams as Record<string, unknown>, replace: true }),
          onNavigateToSessionDetail: (session) =>
            session.id && void navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id } }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})
