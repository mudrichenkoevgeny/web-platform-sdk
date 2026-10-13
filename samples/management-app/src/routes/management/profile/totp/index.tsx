import { createFileRoute } from '@tanstack/react-router'
import {
  TotpMainScreen,
  totpMainSearchSchema,
  TotpMainMode
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/profile/totp/')({
  validateSearch: totpMainSearchSchema,
  component: function TotpMainRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()
    const search = Route.useSearch()

    if (!appComponent) return null

    return (
      <TotpMainScreen
        dependencies={{
          totpMode: search.totpMode,
          onTotpModeChange: (totpMode: TotpMainMode) =>
            void navigate({ search: (prev) => ({ ...prev, totpMode }) }),
          userRepository: appComponent.managementUserComponent.selfUserRepository,
          setupTotpUseCase: appComponent.managementUserComponent.setupTotpUseCase,
          enableTotpUseCase: appComponent.managementUserComponent.enableTotpUseCase,
          disableTotpUseCase: appComponent.managementUserComponent.disableTotpUseCase,
          onNavigateToRecoveryCodes: () => navigate({ to: '/management/profile/totp/recovery' }),
          onBack: () => navigateUp({ to: '/management/profile' })
        }}
      />
    )
  }
})
