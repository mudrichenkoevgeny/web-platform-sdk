import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GlobalUserListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/users/')({
  component: function GlobalUserListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <GlobalUserListScreen
        dependencies={{
          getUsersUseCase: managementDeps.getUsersUseCase,
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onNavigateToCreateUser: () => navigate({ to: '/management/users/new' }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
