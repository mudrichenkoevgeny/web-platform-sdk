import { createFileRoute } from '@tanstack/react-router'
import { UnlockTargetInputScreen, accountUnlockSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/login/unlock')({
  validateSearch: accountUnlockSearchSchema,
  component: function ClientAccountUnlockRoute() {
    const { loginDependencies } = Route.useRouteContext()
    const search = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!loginDependencies) {
      return null
    }

    const method = search.method ?? UnlockMethod.EMAIL

    return (
      <UnlockTargetInputScreen
        dependencies={{
          method,
          onMethodChange: (method) =>
            void navigate({ search: (prev) => ({ ...prev, method }) }),
          sendUnlockEmailConfirmationUseCase: loginDependencies.sendUnlockEmailConfirmationUseCase,
          sendUnlockPhoneConfirmationUseCase: loginDependencies.sendUnlockPhoneConfirmationUseCase,
          onNavigateToOtp: (target, initialDelaySeconds) =>
            navigate({
              to: '/login/unlock-otp',
              search: { method, target, initialDelaySeconds }
            }),
          onBack: () => navigateUp({ to: '/login' })
        }}
      />
    )
  }
})
