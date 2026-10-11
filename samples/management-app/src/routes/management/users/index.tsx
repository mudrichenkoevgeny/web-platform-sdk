import { createFileRoute } from '@tanstack/react-router'
import { GlobalUserListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/users/')({
  component: function GlobalUserListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <GlobalUserListScreen
        dependencies={{
          getUsersUseCase: managementDeps.getUsersUseCase,
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onNavigateToCreateUser: () => navigate({ to: '/management/users/new' }),
          onBack: () => navigateUp({ to: '/management' })
        }}
      />
    )
  }
})
