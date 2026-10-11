import { createFileRoute } from '@tanstack/react-router'
import { UnlockTargetInputScreen, accountUnlockSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/login/unlock')({
  validateSearch: accountUnlockSearchSchema,
  component: function ClientAccountUnlockRoute() {
    const { loginDependencies } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    if (!loginDependencies) {
      return null
    }

    return (
      <UnlockTargetInputScreen
        dependencies={{
          method: UnlockMethod.EMAIL,
          sendUnlockEmailConfirmationUseCase: loginDependencies.sendUnlockEmailConfirmationUseCase,
          sendUnlockPhoneConfirmationUseCase: loginDependencies.sendUnlockPhoneConfirmationUseCase,
          onNavigateToOtp: (target, initialDelaySeconds) =>
            navigate({
              to: '/login/unlock-otp',
              search: { method: UnlockMethod.EMAIL, target, initialDelaySeconds }
            }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
