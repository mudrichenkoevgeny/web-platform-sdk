import { createFileRoute } from '@tanstack/react-router'
import { MainUserScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType, ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'

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
          onNavigateToLogin: () => {},
          onNavigateToTotp: () => navigate({ to: ManagementSelfUserNavigation.TotpMain.ROUTE, search: (prev: Record<string, unknown>) => prev }),
          onNavigateToSessions: () => navigate({ to: ManagementSelfUserNavigation.SessionList.ROUTE, search: (prev: Record<string, unknown>) => prev }),
          onNavigateToIdentifiers: () => navigate({ to: ManagementSelfUserNavigation.IdentifierList.ROUTE, search: (prev: Record<string, unknown>) => prev })
        }}
      />
    )
  }
})
