import { createFileRoute } from '@tanstack/react-router'
import { GlobalSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementMainNavigation, managementGlobalSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/sessions/')({
  validateSearch: (rawSearch) => cleanSearchParams(managementGlobalSessionListParamsSchema.parse(rawSearch)),
  component: function GlobalSessionListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <GlobalSessionListScreen
        dependencies={{
          managementGetSessionsUseCase: managementDeps.managementGetSessionsUseCase,
          managementDeleteSessionUseCase: managementDeps.managementDeleteSessionUseCase,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }) }),
          onNavigateToSessionDetail: (session) =>
            session.id && void navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id } }),
          onNavigateToUserDetail: (userId) =>
            void navigate({ to: '/users/$userId', params: { userId } }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})
