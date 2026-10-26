import { createFileRoute } from '@tanstack/react-router'
import { EditAuthSettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementAuthSettingsNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for administrative auth settings screen. */
export const Route = createFileRoute('/settings/auth')({
  component: function EditAuthSettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <EditAuthSettingsScreen
        dependencies={{
          getManagementAuthSettingsUseCase: managementDeps.getManagementAuthSettingsUseCase,
          updateManagementAuthSettingsUseCase: managementDeps.updateManagementAuthSettingsUseCase,
          resetManagementAuthSettingsUseCase: managementDeps.resetManagementAuthSettingsUseCase,
          onBack: () => navigateUp({ to: ManagementAuthSettingsNavigation.AuthSettings.parentRoute })
        }}
      />
    )
  }
})
