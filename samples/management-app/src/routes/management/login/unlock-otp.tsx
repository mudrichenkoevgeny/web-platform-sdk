import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UnlockOtpScreen, unlockOtpSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/management/login/unlock-otp')({
  validateSearch: unlockOtpSearchSchema,
  component: function UnlockOtpRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <UnlockOtpScreen
        dependencies={{
          method: searchParams.method ?? UnlockMethod.EMAIL,
          target: searchParams.target ?? '',
          initialDelaySeconds: searchParams.initialDelaySeconds,
          unlockByEmailUseCase: managementDeps.unlockByEmailUseCase,
          unlockByPhoneUseCase: managementDeps.unlockByPhoneUseCase,
          sendUnlockEmailConfirmationUseCase: managementDeps.sendUnlockEmailConfirmationUseCase,
          sendUnlockPhoneConfirmationUseCase: managementDeps.sendUnlockPhoneConfirmationUseCase,
          onUnlockSuccess: () => navigate({ to: '..' }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
