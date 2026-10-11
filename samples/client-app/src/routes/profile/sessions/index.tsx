import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SelfSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const Route = createFileRoute('/profile/sessions/')({
  component: function SelfSessionListRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    if (!appComponent) return null

    return (
      <SelfSessionListScreen
        dependencies={{
          getSessionsUseCase: appComponent.clientUserComponent.getSessionsUseCase,
          deleteSessionUseCase: appComponent.clientUserComponent.deleteSessionUseCase,
          deleteAllOtherSessionsUseCase: appComponent.clientUserComponent.deleteAllOtherSessionsUseCase,
          authStorage: appComponent.clientUserComponent.authStorage,
          onNavigateToSessionDetail: (session) =>
            navigate({ to: '/profile/sessions/$sessionId', params: { sessionId: session.id } }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
