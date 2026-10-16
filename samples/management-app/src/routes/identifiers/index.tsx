import { createFileRoute } from '@tanstack/react-router'
import { GlobalIdentifierListScreen, globalIdentifierListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementMainNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/identifiers/')({
  validateSearch: (rawSearch) => parseSearchParams(globalIdentifierListSearchSchema, rawSearch),
  component: function GlobalIdentifierListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <GlobalIdentifierListScreen
        dependencies={{
          managementGetIdentifiersUseCase: managementDeps.managementGetIdentifiersUseCase,
          managementDeleteIdentifierUseCase: managementDeps.managementDeleteIdentifierUseCase,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToIdentifierDetail: (identifierId) =>
            void navigate({ to: '/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})
