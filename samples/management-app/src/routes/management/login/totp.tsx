import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoginByTotpScreen, loginByTotpSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const Route = createFileRoute('/management/login/totp')({
  validateSearch: loginByTotpSearchSchema,
  component: function LoginByTotpRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { mfaToken = '' } = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <LoginByTotpScreen
        dependencies={{
          mfaToken,
          loginByTotpUseCase: managementDeps.loginByTotpUseCase,
          loginByTotpRecoveryCodeUseCase: managementDeps.loginByTotpRecoveryCodeUseCase,
          onNavigateToPendingDeletion: () => navigate({ to: '..' }),
          onBack: () => navigate({ to: '..' }),
          onFinished: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
