import { createFileRoute } from '@tanstack/react-router'
import { SelfSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSelfUserNavigation, selfSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/sessions/')({
  validateSearch: (rawSearch) => cleanSearchParams(selfSessionListParamsSchema.parse(rawSearch) as Record<string, unknown>),
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
            session.id && void navigate({ to: '/user/sessions/$sessionId', params: { sessionId: session.id } }),
          onBack: () => navigateUp({ to: ManagementSelfUserNavigation.Main.route })
        }}
      />
    )
  }
})
