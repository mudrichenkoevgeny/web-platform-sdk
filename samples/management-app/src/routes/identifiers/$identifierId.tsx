import { createFileRoute } from '@tanstack/react-router'
import { IdentifierDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementUsersNavigation, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { globalIdentifierListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { appResultFailure, cleanSearchParams, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/identifiers/$identifierId')({
  component: function IdentifierDetailRoute() {
    const { managementDeps } = Route.useRouteContext()
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
            execute: (id) =>
              managementDeps.managementGetIdentifierUseCase
                ? managementDeps.managementGetIdentifierUseCase.execute(id)
                : Promise.resolve(appResultFailure(CommonError.unknown()))
          },
          deleteUserIdentifierUseCase: {
            execute: async (id) => {
              if (!managementDeps.managementGetIdentifierUseCase) {
                return appResultFailure(CommonError.unknown())
              }

              const idRes = await managementDeps.managementGetIdentifierUseCase.execute(id)
              if (!isSuccess(idRes)) {
                return idRes
              }

              return managementDeps.managementDeleteIdentifierUseCase.execute(idRes.data.userId, id)
            }
          },
          deletePasswordUseCase: {
            execute: async (id) => {
              if (!managementDeps.managementGetIdentifierUseCase) {
                return appResultFailure(CommonError.unknown())
              }

              const idRes = await managementDeps.managementGetIdentifierUseCase.execute(id)
              if (!isSuccess(idRes)) {
                return idRes
              }

              return managementDeps.managementDeleteIdentifierPasswordUseCase.execute(idRes.data.userId, id)
            }
          },
          currentUserId: managementDeps.currentUserId,
          onNavigateToUserDetail: (userId) =>
            void navigate({ to: '/users/$userId', params: { userId } }),
          onNavigateToProfile: () => void navigate({ to: '/user' }),
          onBack: () => navigateUp({ to: ManagementUsersNavigation.GlobalIdentifierList.ROUTE, search: (raw) => cleanSearchParams(globalIdentifierListSearchSchema.parse(raw)) })
        }}
      />
    )
  }
})
