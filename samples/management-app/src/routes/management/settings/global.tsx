import { createFileRoute } from '@tanstack/react-router'
import { EditGlobalSettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/settings/global')({
  component: function EditGlobalSettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <EditGlobalSettingsScreen
        dependencies={{
          getManagementGlobalSettingsUseCase: managementDeps.getManagementGlobalSettingsUseCase,
          saveRemoteGlobalSettingsUseCase: managementDeps.saveRemoteGlobalSettingsUseCase,
          resetRemoteGlobalSettingsUseCase: managementDeps.resetRemoteGlobalSettingsUseCase,
          onBack: () => navigateUp({ to: '/management' })
        }}
      />
    )
  }
})
