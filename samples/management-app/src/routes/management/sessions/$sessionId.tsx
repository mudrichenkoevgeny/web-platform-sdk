import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { GetSessionUseCase, DeleteSessionUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export const Route = createFileRoute('/management/sessions/$sessionId')({
  component: function SessionDetailRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { sessionId } = Route.useParams()
    const navigate = Route.useNavigate()

    if (!managementDeps) {
      return null
    }

    const getSessionUseCase: GetSessionUseCase = {
      execute: async (id: UserSessionId) => {
        if (managementDeps.managementGetSessionUseCase) {
          return managementDeps.managementGetSessionUseCase.execute(id)
        }
        return appResultFailure(CommonError.unknown())
      }
    }

    const deleteSessionUseCase: DeleteSessionUseCase = {
      execute: async (targetSessionId: UserSessionId) => {
        if (!managementDeps.managementGetSessionUseCase) {
          return appResultFailure(CommonError.unknown())
        }

        const sessionRes = await managementDeps.managementGetSessionUseCase.execute(targetSessionId)
        if (!isSuccess(sessionRes)) {
          return sessionRes
        }

        return managementDeps.managementDeleteSessionUseCase.execute(sessionRes.data.userId, targetSessionId)
      }
    }

    return (
      <SessionDetailScreen
        dependencies={{
          sessionId: toUserSessionIdOrThrow(sessionId),
          getSessionUseCase,
          deleteSessionUseCase,
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/management/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onNavigateToProfile: managementDeps.onNavigateToProfile,
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
