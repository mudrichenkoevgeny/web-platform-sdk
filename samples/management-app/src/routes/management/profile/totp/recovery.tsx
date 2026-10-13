import { createFileRoute } from '@tanstack/react-router'
import { TotpRecoveryCodesScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/profile/totp/recovery')({
  component: function TotpRecoveryCodesRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <TotpRecoveryCodesScreen
        dependencies={{
          getRecoveryCodesUseCase: appComponent.managementUserComponent.getRecoveryCodesUseCase,
          regenerateRecoveryCodesUseCase: appComponent.managementUserComponent.regenerateRecoveryCodesUseCase,
          onBack: () => navigateUp({ to: '/management/profile/totp' })
        }}
      />
    )
  }
})
