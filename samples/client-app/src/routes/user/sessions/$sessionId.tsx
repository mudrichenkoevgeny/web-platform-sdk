import { createFileRoute } from '@tanstack/react-router'
import { SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation, selfSessionListParamsSchema, type UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/sessions/$sessionId')({
  component: function UserSessionDetailRoute() {
    const { appComponent } = Route.useRouteContext()
    const { sessionId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    return (
      <SessionDetailScreen
        dependencies={{
          sessionId: sessionId as UserSessionId,
          getSessionUseCase: appComponent.clientUserComponent.getSessionUseCase,
          deleteSessionUseCase: appComponent.clientUserComponent.deleteSessionUseCase,
          authStorage: appComponent.clientUserComponent.authStorage,
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/user/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToProfile: () => navigate({ to: ClientUserNavigation.Main.route }),
          onNavigateToUserDetail: () => navigate({ to: ClientUserNavigation.Main.route }),
          onBack: () =>
            navigateUp({
              to: ClientUserNavigation.SessionList.ROUTE,
              search: (raw) => cleanSearchParams(selfSessionListParamsSchema.parse(raw))
            })
        }}
      />
    )
  }
})
