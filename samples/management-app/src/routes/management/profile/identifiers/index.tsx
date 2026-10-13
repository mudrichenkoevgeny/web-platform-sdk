import { createFileRoute } from '@tanstack/react-router'
import { SelfIdentifierListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/profile/identifiers/')({
  component: function SelfIdentifierListRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <SelfIdentifierListScreen
        dependencies={{
          appType: AppType.MANAGEMENT,
          getUserIdentifiersUseCase: appComponent.managementUserComponent.getUserIdentifiersUseCase,
          getAvailableUserAuthProvidersUseCase:
            appComponent.managementUserComponent.getAvailableUserAuthProvidersUseCase,
          sendAddEmailIdentifierConfirmationUseCase:
            appComponent.managementUserComponent.sendAddEmailIdentifierConfirmationUseCase,
          addUserIdentifierEmailUseCase:
            appComponent.managementUserComponent.addUserIdentifierEmailUseCase,
          sendAddPhoneIdentifierConfirmationUseCase:
            appComponent.managementUserComponent.sendAddPhoneIdentifierConfirmationUseCase,
          addUserIdentifierPhoneUseCase:
            appComponent.managementUserComponent.addUserIdentifierPhoneUseCase,
          authStorage: appComponent.managementUserComponent.authStorage,
          onIdentifierSelect: (identifierId) =>
            navigate({ to: '/management/profile/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigateUp({ to: '/management/profile' })
        }}
      />
    )
  }
})
