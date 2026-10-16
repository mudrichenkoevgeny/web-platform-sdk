import { createFileRoute } from '@tanstack/react-router'
import {
  TotpMainScreen,
  totpMainSearchSchema,
  TotpMainMode
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

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
          userRepository: appComponent.clientUserComponent.userRepository,
          setupTotpUseCase: appComponent.clientUserComponent.setupTotpUseCase,
          enableTotpUseCase: appComponent.clientUserComponent.enableTotpUseCase,
          disableTotpUseCase: appComponent.clientUserComponent.disableTotpUseCase,
          onNavigateToRecoveryCodes: () => navigate({ to: '/user/totp/recovery' }),
          onBack: () => navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})
