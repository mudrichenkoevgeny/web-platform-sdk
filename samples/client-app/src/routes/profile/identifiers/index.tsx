import { createFileRoute } from '@tanstack/react-router'
import { SelfIdentifierListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/profile/identifiers/')({
  component: function SelfIdentifierListRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <SelfIdentifierListScreen
        dependencies={{
          appType: AppType.CLIENT,
          getUserIdentifiersUseCase: appComponent.clientUserComponent.getUserIdentifiersUseCase,
          getAvailableUserAuthProvidersUseCase:
            appComponent.clientUserComponent.getAvailableUserAuthProvidersUseCase,
          sendAddEmailIdentifierConfirmationUseCase:
            appComponent.clientUserComponent.sendAddEmailIdentifierConfirmationUseCase,
          addUserIdentifierEmailUseCase:
            appComponent.clientUserComponent.addUserIdentifierEmailUseCase,
          sendAddPhoneIdentifierConfirmationUseCase:
            appComponent.clientUserComponent.sendAddPhoneIdentifierConfirmationUseCase,
          addUserIdentifierPhoneUseCase:
            appComponent.clientUserComponent.addUserIdentifierPhoneUseCase,
          addUserIdentifierGoogleUseCase:
            appComponent.clientUserComponent.addUserIdentifierGoogleUseCase,
          identifierRepository: appComponent.clientUserComponent.identifierRepository,
          authStorage: appComponent.clientUserComponent.authStorage,
          onIdentifierSelect: (identifierId) =>
            navigate({ to: '/profile/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigateUp({ to: '/profile' })
        }}
      />
    )
  }
})
