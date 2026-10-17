import { createFileRoute } from '@tanstack/react-router'
import { ManagementAuthNavigation, ManagementMainNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { ResetEmailPasswordScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for email password reset screen. */
export const Route = createFileRoute('/auth/reset-password/')({
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ManagementResetPasswordRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <ResetEmailPasswordScreen
            dependencies={{
              resetPasswordRepository: appComponent.managementUserComponent.selfManagementResetPasswordRepository,
              sendResetPasswordConfirmationToEmailUseCase: appComponent.managementUserComponent.sendResetPasswordConfirmationToEmailUseCase,
              resetEmailPasswordUseCase: appComponent.managementUserComponent.resetEmailPasswordUseCase,
              validatePasswordUseCase: appComponent.securityComponent.validatePasswordUseCase,
              onBack: () => navigateUp({ to: ManagementAuthNavigation.Main.ROUTE }),
              onFinished: () => void navigate({ to: ManagementMainNavigation.Main.route, replace: true })
            }}
          />
        </div>
      </div>
    )
  }
})
