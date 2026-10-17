import { createFileRoute } from '@tanstack/react-router'
import { SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementUsersNavigation, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { globalSessionListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { appResultFailure, cleanSearchParams, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for global user session detail screen. */
export const Route = createFileRoute('/sessions/$sessionId')({
  component: function SessionDetailRoute() {
    const { appComponent, managementDeps } = Route.useRouteContext()
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
            execute: async (id) => {
              if (!managementDeps.managementGetSessionUseCase) {
                return appResultFailure(CommonError.unknown())
              }
              const sessionResult = await managementDeps.managementGetSessionUseCase.execute(id)
              if (
                isSuccess(sessionResult) &&
                appComponent &&
                managementDeps.currentUserId != null &&
                sessionResult.data.userId === managementDeps.currentUserId
              ) {
                return appComponent.managementUserComponent.getSessionUseCase.execute(id)
              }
              return sessionResult
            }
          },
          deleteSessionUseCase: {
            execute: async (targetSessionId) => {
              if (!managementDeps.managementGetSessionUseCase) {
                return appResultFailure(CommonError.unknown())
              }

              const sessionResult = await managementDeps.managementGetSessionUseCase.execute(targetSessionId)
              if (!isSuccess(sessionResult)) {
                return sessionResult
              }

              if (
                managementDeps.currentUserId != null &&
                sessionResult.data.userId === managementDeps.currentUserId
              ) {
                return appResultFailure(CommonError.lifecycle('Cannot delete current user session'))
              }

              return managementDeps.managementDeleteSessionUseCase.execute(sessionResult.data.userId, targetSessionId)
            }
          },
          authStorage: appComponent?.managementUserComponent.authStorage,
          currentUserId: managementDeps.currentUserId,
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToUserDetail: (userId) =>
            void navigate({ to: '/users/$userId', params: { userId } }),
          onNavigateToUserMain: () => void navigate({ to: '/user' }),
          onBack: () => navigateUp({ to: ManagementUsersNavigation.GlobalSessionList.ROUTE, search: (raw) => cleanSearchParams(globalSessionListSearchSchema.parse(raw)) })
        }}
      />
    )
  }
})
