import { createFileRoute } from '@tanstack/react-router'
import { GlobalSessionListScreen, globalSessionListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementMainNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for global user session list screen. */
export const Route = createFileRoute('/sessions/')({
  validateSearch: (rawSearch) => parseSearchParams(globalSessionListSearchSchema, rawSearch),
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
          currentUserId: managementDeps.currentUserId,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }), replace: true }),
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
