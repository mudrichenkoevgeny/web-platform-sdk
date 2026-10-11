import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GlobalSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/sessions/')({
  component: function GlobalSessionListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <GlobalSessionListScreen
        dependencies={{
          managementGetSessionsUseCase: managementDeps.managementGetSessionsUseCase,
          managementDeleteSessionUseCase: managementDeps.managementDeleteSessionUseCase,
          onNavigateToSessionDetail: (session) =>
            navigate({ to: '/management/sessions/$sessionId', params: { sessionId: session.id } }),
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
