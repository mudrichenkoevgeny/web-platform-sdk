import { createFileRoute } from '@tanstack/react-router'
import { MainUserScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType, ClientAuthNavigation, ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/user/')({
  component: function MainUserRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    if (!appComponent) return null

    return (
      <MainUserScreen
        dependencies={{
          appType: AppType.CLIENT,
          userRepository: appComponent.clientUserComponent.userRepository,
          logoutUseCase: appComponent.clientUserComponent.logoutUseCase,
          scheduleUserDeletionUseCase: appComponent.clientUserComponent.scheduleUserDeletionUseCase,
          getAuthSettingsUseCase: appComponent.clientUserComponent.getAuthSettingsUseCase,
          observeAuthSettingsUseCase: appComponent.clientUserComponent.observeAuthSettingsUseCase,
          onNavigateToLogin: () => navigate({ to: ClientAuthNavigation.Main.ROUTE }),
          onNavigateToTotp: () => navigate({ to: ClientUserNavigation.TotpMain.ROUTE, search: (prev: Record<string, unknown>) => prev }),
          onNavigateToSessions: () => navigate({ to: ClientUserNavigation.SessionList.ROUTE, search: (prev: Record<string, unknown>) => prev }),
          onNavigateToIdentifiers: () => navigate({ to: ClientUserNavigation.IdentifierList.ROUTE, search: (prev: Record<string, unknown>) => prev })
        }}
      />
    )
  }
})
