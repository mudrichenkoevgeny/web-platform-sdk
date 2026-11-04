import { createFileRoute } from '@tanstack/react-router'
import { MainUserScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType, ManagementAuthNavigation, ManagementSelfUserNavigation, ManagementSelfStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration for self user main dashboard screen. */
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
          appType: AppType.MANAGEMENT,
          userRepository: appComponent.managementUserComponent.selfUserRepository,
          logoutUseCase: appComponent.managementUserComponent.logoutUseCase,
          scheduleUserDeletionUseCase: appComponent.managementUserComponent.scheduleUserDeletionUseCase,
          onNavigateToLogin: () => void navigate({ to: ManagementAuthNavigation.Main.ROUTE }),
          onNavigateToTotp: () => void navigate({ to: ManagementSelfUserNavigation.TotpMain.ROUTE }),
          onNavigateToSessions: () => void navigate({ to: ManagementSelfUserNavigation.SessionList.ROUTE }),
          onNavigateToIdentifiers: () => void navigate({ to: ManagementSelfUserNavigation.IdentifierList.ROUTE }),
          onNavigateToStorage: () => void navigate({ to: ManagementSelfStorageNavigation.FileList.ROUTE }),
          onNavigateToEditUser: () => void navigate({ to: ManagementSelfUserNavigation.UserEdit.route })
        }}
      />
    )
  }
})
