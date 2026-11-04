import { createFileRoute } from '@tanstack/react-router'
import { IdentifierListScreen, createManagementIdentifierListDataSource } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementMainNavigation, managementGlobalIdentifierListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for global user identifier list screen. */
export const Route = createFileRoute('/identifiers/')({
  validateSearch: (rawSearch) => parseSearchParams(managementGlobalIdentifierListParamsSchema, rawSearch),
  component: function GlobalIdentifierListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <IdentifierListScreen
        includeOwnerFilter
        dependencies={{
          dataSource: createManagementIdentifierListDataSource({
            managementGetIdentifiersUseCase: managementDeps.managementGetIdentifiersUseCase
          }),
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: newParams as Record<string, unknown>, replace: true }),
          onIdentifierSelect: (identifierId) =>
            void navigate({ to: '/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})
