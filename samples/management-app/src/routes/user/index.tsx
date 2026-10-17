import { createFileRoute } from '@tanstack/react-router'
import { MainUserScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType, ManagementAuthNavigation, ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration for self user profile main dashboard screen. */
export const Route = createFileRoute('/user/')({
  component: function MainUserRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    if (!appComponent) return null

    return (
      <MainUserScreen
        dependencies={{
          appType: AppType.MANAGEMENT,
          userRepository: appComponent.managementUserComponent.selfUserRepository,
          logoutUseCase: appComponent.managementUserComponent.logoutUseCase,
          scheduleUserDeletionUseCase: appComponent.managementUserComponent.scheduleUserDeletionUseCase,
          onNavigateToLogin: () => navigate({ to: ManagementAuthNavigation.Main.ROUTE }),
          onNavigateToTotp: () => navigate({ to: ManagementSelfUserNavigation.TotpMain.ROUTE }),
          onNavigateToSessions: () => navigate({ to: ManagementSelfUserNavigation.SessionList.ROUTE }),
          onNavigateToIdentifiers: () => navigate({ to: ManagementSelfUserNavigation.IdentifierList.ROUTE })
        }}
      />
    )
  }
})
