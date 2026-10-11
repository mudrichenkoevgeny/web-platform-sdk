import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TotpRecoveryCodesScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const Route = createFileRoute('/profile/totp/recovery')({
  component: function TotpRecoveryCodesRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    if (!appComponent) return null

    return (
      <TotpRecoveryCodesScreen
        dependencies={{
          getRecoveryCodesUseCase: appComponent.clientUserComponent.getRecoveryCodesUseCase,
          regenerateRecoveryCodesUseCase: appComponent.clientUserComponent.regenerateRecoveryCodesUseCase,
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
