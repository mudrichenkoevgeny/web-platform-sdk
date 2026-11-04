import { createFileRoute } from '@tanstack/react-router'
import { IdentifierListScreen, createSelfIdentifierListDataSource } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation, selfIdentifierListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/identifiers/')({
  validateSearch: (rawSearch) => parseSearchParams(selfIdentifierListParamsSchema, rawSearch),
  component: function IdentifierListRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    return (
      <IdentifierListScreen
        dependencies={{
          dataSource: createSelfIdentifierListDataSource({
            getIdentifiersUseCase: appComponent.clientUserComponent.getUserIdentifiersUseCase,
            getAvailableUserAuthProvidersUseCase:
              appComponent.clientUserComponent.getAvailableUserAuthProvidersUseCase,
            sendAddEmailIdentifierConfirmationUseCase:
              appComponent.clientUserComponent.sendAddEmailIdentifierConfirmationUseCase,
            addEmailIdentifierUseCase:
              appComponent.clientUserComponent.addUserIdentifierEmailUseCase,
            sendAddPhoneIdentifierConfirmationUseCase:
              appComponent.clientUserComponent.sendAddPhoneIdentifierConfirmationUseCase,
            addPhoneIdentifierUseCase:
              appComponent.clientUserComponent.addUserIdentifierPhoneUseCase,
            addGoogleIdentifierUseCase:
              appComponent.clientUserComponent.addUserIdentifierGoogleUseCase
          }),
          authStorage: appComponent.clientUserComponent.authStorage,
          onIdentifierSelect: (identifierId) =>
            void navigate({ to: '/user/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => void navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})
