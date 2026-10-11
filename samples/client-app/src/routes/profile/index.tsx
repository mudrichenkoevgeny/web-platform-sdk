import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MainProfileScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/profile/')({
  component: function MainProfileRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    if (!appComponent) return null

    return (
      <MainProfileScreen
        dependencies={{
          appType: AppType.CLIENT,
          userRepository: appComponent.clientUserComponent.userRepository,
          logoutUseCase: appComponent.clientUserComponent.logoutUseCase,
          scheduleUserDeletionUseCase: appComponent.clientUserComponent.scheduleUserDeletionUseCase,
          getAuthSettingsUseCase: appComponent.clientUserComponent.getAuthSettingsUseCase,
          observeAuthSettingsUseCase: appComponent.clientUserComponent.observeAuthSettingsUseCase,
          onNavigateToLogin: () => navigate({ to: '/login' }),
          onNavigateToTotp: () => navigate({ to: '/profile/totp' }),
          onNavigateToSessions: () => navigate({ to: '/profile/sessions' }),
          onNavigateToIdentifiers: () => navigate({ to: '/profile/identifiers' })
        }}
      />
    )
  }
})
