import { createFileRoute } from '@tanstack/react-router'
import { EditStorageSettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementMainNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for storage settings editing screen. */
export const Route = createFileRoute('/settings/storage')({
  component: function EditStorageSettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <EditStorageSettingsScreen
        dependencies={{
          getManagementStorageSettingsUseCase: managementDeps.getManagementStorageSettingsUseCase,
          updateManagementStorageSettingsUseCase: managementDeps.updateManagementStorageSettingsUseCase,
          resetManagementStorageSettingsUseCase: managementDeps.resetManagementStorageSettingsUseCase,
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})
