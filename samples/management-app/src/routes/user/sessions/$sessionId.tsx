import { createFileRoute } from '@tanstack/react-router'
import { SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSelfUserNavigation, selfSessionListParamsSchema, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/sessions/$sessionId')({
  component: function UserSessionDetailRoute() {
    const { appComponent } = Route.useRouteContext()
    const { sessionId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <SessionDetailScreen
        dependencies={{
          sessionId: toUserSessionIdOrThrow(sessionId),
          getSessionUseCase: appComponent.managementUserComponent.getSessionUseCase,
          deleteSessionUseCase: appComponent.managementUserComponent.deleteSessionUseCase,
          authStorage: appComponent.managementUserComponent.authStorage,
          onNavigateToIdentifierDetail: (identifierId) =>
            void navigate({ to: '/user/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToProfile: () => void navigate({ to: ManagementSelfUserNavigation.Main.route }),
          onNavigateToUserDetail: () => void navigate({ to: ManagementSelfUserNavigation.Main.route }),
          onBack: () =>
            navigateUp({
              to: ManagementSelfUserNavigation.SessionList.ROUTE,
              search: (raw) => cleanSearchParams(selfSessionListParamsSchema.parse(raw) as Record<string, unknown>)
            })
        }}
      />
    )
  }
})
