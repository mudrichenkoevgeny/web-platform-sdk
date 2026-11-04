import { createFileRoute } from '@tanstack/react-router'
import { IdentifierListScreen, createSelfIdentifierListDataSource } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSelfUserNavigation, selfIdentifierListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for self user identifier list screen. */
export const Route = createFileRoute('/user/identifiers/')({
  validateSearch: (rawSearch) => parseSearchParams(selfIdentifierListParamsSchema, rawSearch),
  component: function SelfIdentifierListRoute() {
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
            getIdentifiersUseCase: appComponent.managementUserComponent.getUserIdentifiersUseCase,
            getAvailableUserAuthProvidersUseCase:
              appComponent.managementUserComponent.getAvailableUserAuthProvidersUseCase,
            sendAddEmailIdentifierConfirmationUseCase:
              appComponent.managementUserComponent.sendAddEmailIdentifierConfirmationUseCase,
            addEmailIdentifierUseCase:
              appComponent.managementUserComponent.addUserIdentifierEmailUseCase,
            sendAddPhoneIdentifierConfirmationUseCase:
              appComponent.managementUserComponent.sendAddPhoneIdentifierConfirmationUseCase,
            addPhoneIdentifierUseCase:
              appComponent.managementUserComponent.addUserIdentifierPhoneUseCase
          }),
          authStorage: appComponent.managementUserComponent.authStorage,
          onIdentifierSelect: (identifierId) =>
            void navigate({ to: '/user/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => void navigateUp({ to: ManagementSelfUserNavigation.Main.route })
        }}
      />
    )
  }
})
