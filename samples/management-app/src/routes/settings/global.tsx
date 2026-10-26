import { createFileRoute } from '@tanstack/react-router'
import { EditGlobalSettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementSettingsNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for administrative global settings screen. */
export const Route = createFileRoute('/settings/global')({
  component: function EditGlobalSettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <EditGlobalSettingsScreen
        dependencies={{
          getManagementGlobalSettingsUseCase: managementDeps.getManagementGlobalSettingsUseCase,
          updateManagementGlobalSettingsUseCase: managementDeps.updateManagementGlobalSettingsUseCase,
          resetManagementGlobalSettingsUseCase: managementDeps.resetManagementGlobalSettingsUseCase,
          onBack: () => navigateUp({ to: ManagementSettingsNavigation.GlobalSettings.parentRoute })
        }}
      />
    )
  }
})
