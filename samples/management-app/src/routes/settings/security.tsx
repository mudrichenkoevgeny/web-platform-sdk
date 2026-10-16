import { createFileRoute } from '@tanstack/react-router'
import { EditSecuritySettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementSecurityNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/settings/security')({
  component: function EditSecuritySettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <EditSecuritySettingsScreen
        dependencies={{
          getManagementSecuritySettingsUseCase: managementDeps.getManagementSecuritySettingsUseCase,
          saveRemoteSecuritySettingsUseCase: managementDeps.saveRemoteSecuritySettingsUseCase,
          resetRemoteSecuritySettingsUseCase: managementDeps.resetRemoteSecuritySettingsUseCase,
          onBack: () => navigateUp({ to: ManagementSecurityNavigation.SecuritySettings.parentRoute })
        }}
      />
    )
  }
})
