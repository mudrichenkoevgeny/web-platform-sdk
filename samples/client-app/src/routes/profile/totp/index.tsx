import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  TotpMainScreen,
  totpMainSearchSchema
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const Route = createFileRoute('/profile/totp/')({
  validateSearch: totpMainSearchSchema,
  component: function TotpMainRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const search = Route.useSearch()

    if (!appComponent) return null

    return (
      <TotpMainScreen
        dependencies={{
          totpMode: search.totpMode,
          onTotpModeChange: (totpMode) =>
            void navigate({ search: (prev) => ({ ...prev, totpMode }) }),
          userRepository: appComponent.clientUserComponent.userRepository,
          setupTotpUseCase: appComponent.clientUserComponent.setupTotpUseCase,
          enableTotpUseCase: appComponent.clientUserComponent.enableTotpUseCase,
          disableTotpUseCase: appComponent.clientUserComponent.disableTotpUseCase,
          onNavigateToRecoveryCodes: () => navigate({ to: '/profile/totp/recovery' }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
