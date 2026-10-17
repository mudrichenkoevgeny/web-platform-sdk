import { createFileRoute } from '@tanstack/react-router'
import { IdentifierDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementUsersNavigation, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { globalIdentifierListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { appResultFailure, cleanSearchParams, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for global user identifier detail screen. */
export const Route = createFileRoute('/identifiers/$identifierId')({
  component: function IdentifierDetailRoute() {
    const { appComponent, managementDeps } = Route.useRouteContext()
    const { identifierId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!managementDeps) {
      return null
    }

    return (
      <IdentifierDetailScreen
        dependencies={{
          identifierId: toUserIdentifierIdOrThrow(identifierId),
          getUserIdentifierUseCase: {
            execute: async (id) => {
              if (!managementDeps.managementGetIdentifierUseCase) {
                return appResultFailure(CommonError.unknown())
              }
              const identifierResult = await managementDeps.managementGetIdentifierUseCase.execute(id)
              if (
                isSuccess(identifierResult) &&
                appComponent &&
                managementDeps.currentUserId != null &&
                identifierResult.data.userId === managementDeps.currentUserId
              ) {
                return appComponent.managementUserComponent.getUserIdentifierUseCase.execute(id)
              }
              return identifierResult
            }
          },
          deleteUserIdentifierUseCase: {
            execute: async (id) => {
              if (!managementDeps.managementGetIdentifierUseCase) {
                return appResultFailure(CommonError.unknown())
              }

              const identifierResult = await managementDeps.managementGetIdentifierUseCase.execute(id)
              if (!isSuccess(identifierResult)) {
                return identifierResult
              }

              if (managementDeps.currentUserId != null && identifierResult.data.userId === managementDeps.currentUserId) {
                return appResultFailure(CommonError.lifecycle('Cannot delete own identifier'))
              }

              return managementDeps.managementDeleteIdentifierUseCase.execute(identifierResult.data.userId, id)
            }
          },
          deletePasswordUseCase: {
            execute: async (id) => {
              if (!managementDeps.managementGetIdentifierUseCase) {
                return appResultFailure(CommonError.unknown())
              }

              const identifierResult = await managementDeps.managementGetIdentifierUseCase.execute(id)
              if (!isSuccess(identifierResult)) {
                return identifierResult
              }

              return managementDeps.managementDeleteIdentifierPasswordUseCase.execute(identifierResult.data.userId, id)
            }
          },
          emailChangePasswordUseCase: appComponent?.managementUserComponent.emailChangePasswordUseCase,
          authStorage: appComponent?.managementUserComponent.authStorage,
          currentUserId: managementDeps.currentUserId,
          onNavigateToUserDetail: (userId) =>
            void navigate({ to: '/users/$userId', params: { userId } }),
          onNavigateToUserMain: () => void navigate({ to: '/user' }),
          onBack: () => navigateUp({ to: ManagementUsersNavigation.GlobalIdentifierList.ROUTE, search: (raw) => cleanSearchParams(globalIdentifierListSearchSchema.parse(raw)) })
        }}
      />
    )
  }
})
