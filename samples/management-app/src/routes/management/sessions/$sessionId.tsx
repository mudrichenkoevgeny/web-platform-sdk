import { createFileRoute } from '@tanstack/react-router'
import { SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/sessions/$sessionId')({
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
            navigate({ to: '/management/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onNavigateToProfile: () => navigate({ to: '/management/profile' }),
          onBack: () => navigateUp({ to: '/management/sessions' })
        }}
      />
    )
  }
})
