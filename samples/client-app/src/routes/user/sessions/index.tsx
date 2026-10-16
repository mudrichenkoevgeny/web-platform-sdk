import { createFileRoute } from '@tanstack/react-router'
import { SelfSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation, selfSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/sessions/')({
  validateSearch: (rawSearch) => parseSearchParams(selfSessionListParamsSchema, rawSearch),
  component: function SelfSessionListRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <SelfSessionListScreen
        dependencies={{
          getSessionsUseCase: appComponent.clientUserComponent.getSessionsUseCase,
          deleteSessionUseCase: appComponent.clientUserComponent.deleteSessionUseCase,
          deleteAllOtherSessionsUseCase: appComponent.clientUserComponent.deleteAllOtherSessionsUseCase,
          authStorage: appComponent.clientUserComponent.authStorage,
          onNavigateToSessionDetail: (session) =>
            session.id && navigate({ to: '/user/sessions/$sessionId', params: { sessionId: session.id } }),
          onBack: () => navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})
