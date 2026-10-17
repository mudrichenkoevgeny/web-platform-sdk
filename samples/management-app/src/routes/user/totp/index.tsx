import { createFileRoute } from '@tanstack/react-router'
import {
  TotpMainScreen,
  totpMainSearchSchema,
  TotpMainMode
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for self user TOTP MFA main management screen. */
export const Route = createFileRoute('/user/totp/')({
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
          onNavigateToRecoveryCodes: () => void navigate({ to: '/user/totp/recovery' }),
          onBack: () => navigateUp({ to: ManagementSelfUserNavigation.Main.route })
        }}
      />
    )
  }
})
