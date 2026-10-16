import { createFileRoute } from '@tanstack/react-router'
import { SelfIdentifierListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AppType, ManagementSelfUserNavigation, selfIdentifierListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/identifiers/')({
  validateSearch: (rawSearch) => parseSearchParams(selfIdentifierListParamsSchema, rawSearch as Record<string, unknown>),
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
            void navigate({ to: '/user/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigateUp({ to: ManagementSelfUserNavigation.Main.route })
        }}
      />
    )
  }
})
