import { createFileRoute } from '@tanstack/react-router'
import { UnlockOtpScreen, unlockOtpSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/login/unlock-otp')({
  validateSearch: unlockOtpSearchSchema,
  component: function ClientUnlockOtpRoute() {
    const { loginDependencies } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()

    if (!loginDependencies) {
      return null
    }

    return (
      <UnlockOtpScreen
        dependencies={{
          method: searchParams.method ?? UnlockMethod.EMAIL,
          target: searchParams.target ?? '',
          initialDelaySeconds: searchParams.initialDelaySeconds,
          unlockByEmailUseCase: loginDependencies.unlockByEmailUseCase,
          unlockByPhoneUseCase: loginDependencies.unlockByPhoneUseCase,
          sendUnlockEmailConfirmationUseCase: loginDependencies.sendUnlockEmailConfirmationUseCase,
          sendUnlockPhoneConfirmationUseCase: loginDependencies.sendUnlockPhoneConfirmationUseCase,
          onUnlockSuccess: () => navigate({ to: '/login' }),
          onBack: () => navigate({ to: '/login' })
        }}
      />
    )
  }
})
