import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UnlockOtpScreen, unlockOtpSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/login/unlock-otp')({
  validateSearch: unlockOtpSearchSchema,
  component: function ClientUnlockOtpRoute() {
    const { loginDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()

    if (!loginDeps) {
      return null
    }

    return (
      <UnlockOtpScreen
        dependencies={{
          method: searchParams.method ?? UnlockMethod.EMAIL,
          target: searchParams.target ?? '',
          initialDelaySeconds: searchParams.initialDelaySeconds,
          unlockByEmailUseCase: loginDeps.unlockByEmailUseCase,
          unlockByPhoneUseCase: loginDeps.unlockByPhoneUseCase,
          sendUnlockEmailConfirmationUseCase: loginDeps.sendUnlockEmailConfirmationUseCase,
          sendUnlockPhoneConfirmationUseCase: loginDeps.sendUnlockPhoneConfirmationUseCase,
          onUnlockSuccess: () => navigate({ to: '..' }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
