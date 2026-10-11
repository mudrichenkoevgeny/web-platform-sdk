import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoginByTotpScreen, loginByTotpSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const Route = createFileRoute('/login/totp')({
  validateSearch: loginByTotpSearchSchema,
  component: function ClientLoginByTotpRoute() {
    const { loginDeps } = Route.useRouteContext()
    const { mfaToken = '' } = Route.useSearch()
    const navigate = Route.useNavigate()

    if (!loginDeps) {
      return null
    }

    return (
      <LoginByTotpScreen
        dependencies={{
          mfaToken,
          loginByTotpUseCase: loginDeps.loginByTotpUseCase,
          loginByTotpRecoveryCodeUseCase: loginDeps.loginByTotpRecoveryCodeUseCase,
          onNavigateToPendingDeletion: () => navigate({ to: '..' }),
          onBack: () => navigate({ to: '..' }),
          onFinished: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
