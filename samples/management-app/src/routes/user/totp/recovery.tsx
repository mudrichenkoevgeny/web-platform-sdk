import { createFileRoute } from '@tanstack/react-router'
import { TotpRecoveryCodesScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/totp/recovery')({
  component: function TotpRecoveryCodesRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <TotpRecoveryCodesScreen
        dependencies={{
          getRecoveryCodesUseCase: appComponent.managementUserComponent.getRecoveryCodesUseCase,
          regenerateRecoveryCodesUseCase: appComponent.managementUserComponent.regenerateRecoveryCodesUseCase,
          onBack: () => navigateUp({ to: ManagementSelfUserNavigation.TotpRecoveryCodes.parentRoute })
        }}
      />
    )
  }
})
