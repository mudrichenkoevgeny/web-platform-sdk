import { createFileRoute } from '@tanstack/react-router'
import { EditSecuritySettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementSecurityNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for administrative security settings screen. */
export const Route = createFileRoute('/settings/security')({
  component: function EditSecuritySettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <EditSecuritySettingsScreen
        dependencies={{
          getManagementSecuritySettingsUseCase: managementDeps.getManagementSecuritySettingsUseCase,
          updateManagementSecuritySettingsUseCase: managementDeps.updateManagementSecuritySettingsUseCase,
          resetManagementSecuritySettingsUseCase: managementDeps.resetManagementSecuritySettingsUseCase,
          onBack: () => navigateUp({ to: ManagementSecurityNavigation.SecuritySettings.parentRoute })
        }}
      />
    )
  }
})
