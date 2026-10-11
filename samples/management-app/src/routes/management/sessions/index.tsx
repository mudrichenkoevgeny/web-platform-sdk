import { createFileRoute } from '@tanstack/react-router'
import { GlobalSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/sessions/')({
  component: function GlobalSessionListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <GlobalSessionListScreen
        dependencies={{
          managementGetSessionsUseCase: managementDeps.managementGetSessionsUseCase,
          managementDeleteSessionUseCase: managementDeps.managementDeleteSessionUseCase,
          onNavigateToSessionDetail: (session) =>
            navigate({ to: '/management/sessions/$sessionId', params: { sessionId: session.id } }),
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onBack: () => navigateUp({ to: '/management' })
        }}
      />
    )
  }
})
