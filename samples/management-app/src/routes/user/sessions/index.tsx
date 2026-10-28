import { createFileRoute } from '@tanstack/react-router'
import { SelfSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSelfUserNavigation, selfSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for self user session list screen. */
export const Route = createFileRoute('/user/sessions/')({
  validateSearch: (rawSearch) => parseSearchParams(selfSessionListParamsSchema, rawSearch),
  component: function SelfSessionListRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

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
