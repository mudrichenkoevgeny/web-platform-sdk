import { createFileRoute } from '@tanstack/react-router'
import { SelfSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/profile/sessions/')({
  component: function SelfSessionListRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <SelfSessionListScreen
        dependencies={{
          getSessionsUseCase: appComponent.managementUserComponent.getSessionsUseCase,
          deleteSessionUseCase: appComponent.managementUserComponent.deleteSessionUseCase,
          deleteAllOtherSessionsUseCase: appComponent.managementUserComponent.deleteAllOtherSessionsUseCase,
          authStorage: appComponent.managementUserComponent.authStorage,
          onNavigateToSessionDetail: (session) =>
            navigate({ to: '/management/profile/sessions/$sessionId', params: { sessionId: session.id } }),
          onBack: () => navigateUp({ to: '/management/profile' })
        }}
      />
    )
  }
})
