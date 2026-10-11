import { createFileRoute } from '@tanstack/react-router'
import { EditAuthSettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/settings/auth')({
  component: function EditAuthSettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <EditAuthSettingsScreen
        dependencies={{
          getManagementAuthSettingsUseCase: managementDeps.getManagementAuthSettingsUseCase,
          saveRemoteAuthSettingsUseCase: managementDeps.saveRemoteAuthSettingsUseCase,
          resetRemoteAuthSettingsUseCase: managementDeps.resetRemoteAuthSettingsUseCase,
          onBack: () => navigateUp({ to: '/management' })
        }}
      />
    )
  }
})
