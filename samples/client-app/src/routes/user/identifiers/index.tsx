import { createFileRoute } from '@tanstack/react-router'
import { SelfIdentifierListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType, ClientUserNavigation, selfIdentifierListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/identifiers/')({
  validateSearch: (rawSearch) => cleanSearchParams(selfIdentifierListParamsSchema.parse(rawSearch)),
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
            navigate({ to: '/user/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})
