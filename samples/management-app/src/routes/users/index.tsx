import { createFileRoute } from '@tanstack/react-router'
import { GlobalUserListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementMainNavigation, managementUserListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/users/')({
  validateSearch: (rawSearch) => cleanSearchParams(managementUserListParamsSchema.parse(rawSearch)),
  component: function GlobalUserListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <GlobalUserListScreen
        dependencies={{
          getUsersUseCase: managementDeps.getUsersUseCase,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }) }),
          onNavigateToUserDetail: (userId) =>
            void navigate({ to: '/users/$userId', params: { userId } }),
          onNavigateToCreateUser: () => void navigate({ to: '/users/new' }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})
