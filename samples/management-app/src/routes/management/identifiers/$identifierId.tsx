import { createFileRoute } from '@tanstack/react-router'
import {
  IdentifierDetailScreen,
  GetUserIdentifierUseCase,
  DeleteUserIdentifierUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

class CustomGetUserIdentifierUseCase extends GetUserIdentifierUseCase {
  public constructor(private readonly managementDeps: ManagementRootStoreDependencies) {
    super(undefined!)
  }

  public override async execute(id: UserIdentifierId) {
    if (this.managementDeps.managementGetIdentifierUseCase) {
      return this.managementDeps.managementGetIdentifierUseCase.execute(id)
    }
    return appResultFailure(CommonError.unknown())
  }
}

class CustomDeleteUserIdentifierUseCase extends DeleteUserIdentifierUseCase {
  public constructor(private readonly managementDeps: ManagementRootStoreDependencies) {
    super(undefined!)
  }

  public override async execute(id: UserIdentifierId) {
    if (!this.managementDeps.managementGetIdentifierUseCase) {
      return appResultFailure(CommonError.unknown())
    }

    const idRes = await this.managementDeps.managementGetIdentifierUseCase.execute(id)
    if (!isSuccess(idRes)) {
      return idRes
    }

    return this.managementDeps.managementDeleteIdentifierUseCase.execute(idRes.data.userId, id)
  }
}

export const Route = createFileRoute('/management/identifiers/$identifierId')({
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
          getUserIdentifierUseCase: new CustomGetUserIdentifierUseCase(managementDeps),
          deleteUserIdentifierUseCase: new CustomDeleteUserIdentifierUseCase(managementDeps),
          deletePasswordUseCase: {
            execute: async (id: UserIdentifierId) => {
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
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onNavigateToProfile: () => navigate({ to: '/management' }),
          onBack: () => navigateUp({ to: '/management/identifiers' })
        }}
      />
    )
  }
})
