import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginByTotpScreen, loginByTotpSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const Route = createFileRoute('/management/login/totp')({
  validateSearch: loginByTotpSearchSchema.extend({
    mfaToken: z.string().optional()
  }),
  component: function LoginByTotpRoute() {
    const { loginDependencies } = Route.useRouteContext()
    const search = Route.useSearch()
    const { mfaToken = '' } = search
    const navigate = Route.useNavigate()

    if (!loginDependencies) {
      return null
    }

    return (
      <LoginByTotpScreen
        dependencies={{
          mfaToken,
          loginTotpMode: search.loginTotpMode,
          onModeChange: (loginTotpMode) =>
            void navigate({ search: (prev) => ({ ...prev, loginTotpMode }) }),
          loginByTotpUseCase: loginDependencies.loginByTotpUseCase,
          loginByTotpRecoveryCodeUseCase: loginDependencies.loginByTotpRecoveryCodeUseCase,
          onNavigateToPendingDeletion: () => navigate({ to: '/management/login' }),
          onBack: () => navigate({ to: '/management/login' }),
          onFinished: () => navigate({ to: '/management/login' })
        }}
      />
    )
  }
})
