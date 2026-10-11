import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { IdentifierDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { GetUserIdentifierUseCase, DeleteUserIdentifierUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export const Route = createFileRoute('/management/identifiers/$identifierId')({
  component: function IdentifierDetailRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { identifierId } = Route.useParams()
    const navigate = Route.useNavigate()

    if (!managementDeps) {
      return null
    }

    const getUserIdentifierUseCase: GetUserIdentifierUseCase = {
      execute: async (id: UserIdentifierId) => {
        if (managementDeps.managementGetIdentifierUseCase) {
          return managementDeps.managementGetIdentifierUseCase.execute(id)
        }
        return appResultFailure(CommonError.unknown())
      }
    }

    const deleteUserIdentifierUseCase: DeleteUserIdentifierUseCase = {
      execute: async (id: UserIdentifierId) => {
        if (!managementDeps.managementGetIdentifierUseCase) {
          return appResultFailure(CommonError.unknown())
        }

        const idRes = await managementDeps.managementGetIdentifierUseCase.execute(id)
        if (!isSuccess(idRes)) {
          return idRes
        }

        return managementDeps.managementDeleteIdentifierUseCase.execute(idRes.data.userId, id)
      }
    }

    return (
      <IdentifierDetailScreen
        dependencies={{
          identifierId: toUserIdentifierIdOrThrow(identifierId),
          getUserIdentifierUseCase,
          deleteUserIdentifierUseCase,
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
          onNavigateToProfile: managementDeps.onNavigateToProfile,
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
