import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UserSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/management/users/$userId/sessions')({
  component: function UserSessionListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { userId } = Route.useParams()
    const navigate = Route.useNavigate()

    if (!managementDeps) {
      return null
    }

    return (
      <UserSessionListScreen
        dependencies={{
          userId: toUserIdOrThrow(userId),
          managementGetSessionsUseCase: managementDeps.managementGetSessionsUseCase,
          managementDeleteSessionUseCase: managementDeps.managementDeleteSessionUseCase,
          managementDeleteAllUserSessionsUseCase: managementDeps.managementDeleteAllUserSessionsUseCase,
          onNavigateToSessionDetail: (session) =>
            navigate({ to: '/management/sessions/$sessionId', params: { sessionId: session.id } }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
