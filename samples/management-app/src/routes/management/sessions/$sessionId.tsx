import { createFileRoute } from '@tanstack/react-router'
import {
  SessionDetailScreen,
  GetSessionUseCase,
  DeleteSessionUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

class CustomGetSessionUseCase extends GetSessionUseCase {
  public constructor(private readonly managementDeps: ManagementRootStoreDependencies) {
    super(undefined!)
  }

  public override async execute(id: UserSessionId) {
    if (this.managementDeps.managementGetSessionUseCase) {
      return this.managementDeps.managementGetSessionUseCase.execute(id)
    }
    return appResultFailure(CommonError.unknown())
  }
}

class CustomDeleteSessionUseCase extends DeleteSessionUseCase {
  public constructor(private readonly managementDeps: ManagementRootStoreDependencies) {
    super(undefined!)
  }

  public override async execute(targetSessionId: UserSessionId) {
    if (!this.managementDeps.managementGetSessionUseCase) {
      return appResultFailure(CommonError.unknown())
    }

    const sessionRes = await this.managementDeps.managementGetSessionUseCase.execute(targetSessionId)
    if (!isSuccess(sessionRes)) {
      return sessionRes
    }

    return this.managementDeps.managementDeleteSessionUseCase.execute(sessionRes.data.userId, targetSessionId)
  }
}

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
          getSessionUseCase: new CustomGetSessionUseCase(managementDeps),
          deleteSessionUseCase: new CustomDeleteSessionUseCase(managementDeps),
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/management/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onNavigateToProfile: () => navigate({ to: '/management' }),
          onBack: () => navigateUp({ to: '/management/sessions' })
        }}
      />
    )
  }
})
