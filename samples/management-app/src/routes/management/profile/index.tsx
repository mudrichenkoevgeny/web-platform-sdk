import { createFileRoute } from '@tanstack/react-router'
import {
  MainProfileScreen
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/management/profile/')({
  component: function MainProfileRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    if (!appComponent) return null

    return (
      <MainProfileScreen
        dependencies={{
          appType: AppType.MANAGEMENT,
          userRepository: appComponent.managementUserComponent.selfUserRepository,
          logoutUseCase: appComponent.managementUserComponent.logoutUseCase,
          scheduleUserDeletionUseCase: appComponent.managementUserComponent.scheduleUserDeletionUseCase,
          onNavigateToLogin: () => navigate({ to: '/management/login' }),
          onNavigateToTotp: () => navigate({ to: '/management/profile/totp' }),
          onNavigateToSessions: () => navigate({ to: '/management/profile/sessions' }),
          onNavigateToIdentifiers: () => navigate({ to: '/management/profile/identifiers' })
        }}
      />
    )
  }
})
