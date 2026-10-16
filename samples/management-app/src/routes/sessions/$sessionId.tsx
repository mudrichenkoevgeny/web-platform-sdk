import { createFileRoute } from '@tanstack/react-router'
import { SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementUsersNavigation, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { globalSessionListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { appResultFailure, cleanSearchParams, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/sessions/$sessionId')({
  component: function SessionDetailRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { sessionId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!managementDeps) {
      return null
    }

    return (
      <SessionDetailScreen
        dependencies={{
          sessionId: toUserSessionIdOrThrow(sessionId),
          getSessionUseCase: {
            execute: (id) =>
              managementDeps.managementGetSessionUseCase
                ? managementDeps.managementGetSessionUseCase.execute(id)
                : Promise.resolve(appResultFailure(CommonError.unknown()))
          },
          deleteSessionUseCase: {
            execute: async (targetSessionId) => {
              if (!managementDeps.managementGetSessionUseCase) {
                return appResultFailure(CommonError.unknown())
              }

              const sessionRes = await managementDeps.managementGetSessionUseCase.execute(targetSessionId)
              if (!isSuccess(sessionRes)) {
                return sessionRes
              }

              return managementDeps.managementDeleteSessionUseCase.execute(sessionRes.data.userId, targetSessionId)
            }
          },
          currentUserId: managementDeps.currentUserId,
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToUserDetail: (userId) =>
            void navigate({ to: '/users/$userId', params: { userId } }),
          onNavigateToProfile: () => void navigate({ to: '/user' }),
          onBack: () => navigateUp({ to: ManagementUsersNavigation.GlobalSessionList.ROUTE, search: (raw) => cleanSearchParams(globalSessionListSearchSchema.parse(raw)) })
        }}
      />
    )
  }
})
