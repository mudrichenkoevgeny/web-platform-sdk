import { createFileRoute } from '@tanstack/react-router'
import { MainUserScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType, ClientAuthNavigation, ClientUserNavigation, OpenStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration for self user main screen. */
export const Route = createFileRoute('/user/')({
  component: function MainUserRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    if (!appComponent) {
      return null
    }

    return (
      <MainUserScreen
        dependencies={{
          appType: AppType.CLIENT,
          userRepository: appComponent.clientUserComponent.userRepository,
          logoutUseCase: appComponent.clientUserComponent.logoutUseCase,
          scheduleUserDeletionUseCase: appComponent.clientUserComponent.scheduleUserDeletionUseCase,
          getAuthSettingsUseCase: appComponent.clientUserComponent.getAuthSettingsUseCase,
          onNavigateToLogin: () => navigate({ to: ClientAuthNavigation.Main.ROUTE }),
          onNavigateToTotp: () => navigate({ to: ClientUserNavigation.TotpMain.ROUTE }),
          onNavigateToSessions: () => navigate({ to: ClientUserNavigation.SessionList.ROUTE }),
          onNavigateToIdentifiers: () => navigate({ to: ClientUserNavigation.IdentifierList.ROUTE }),
          onNavigateToStorage: () => navigate({ to: OpenStorageNavigation.FileList.ROUTE })
        }}
      />
    )
  }
})
