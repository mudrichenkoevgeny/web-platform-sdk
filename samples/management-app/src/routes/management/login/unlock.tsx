import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UnlockTargetInputScreen, accountUnlockSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/management/login/unlock')({
  validateSearch: accountUnlockSearchSchema,
  component: function AccountUnlockRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <UnlockTargetInputScreen
        dependencies={{
          method: UnlockMethod.EMAIL,
          sendUnlockEmailConfirmationUseCase: managementDeps.sendUnlockEmailConfirmationUseCase,
          sendUnlockPhoneConfirmationUseCase: managementDeps.sendUnlockPhoneConfirmationUseCase,
          onNavigateToOtp: (target, initialDelaySeconds) =>
            navigate({
              to: '/management/login/unlock-otp',
              search: { method: UnlockMethod.EMAIL, target, initialDelaySeconds }
            }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
