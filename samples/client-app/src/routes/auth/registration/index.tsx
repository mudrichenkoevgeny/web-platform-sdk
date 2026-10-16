import { createFileRoute } from '@tanstack/react-router'
import { ClientAuthNavigation, ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { RegistrationByEmailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/auth/registration/')({
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ClientRegistrationRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <RegistrationByEmailScreen
            dependencies={{
              registrationRepository: appComponent.clientUserComponent.registrationRepository,
              sendRegistrationConfirmationToEmailUseCase: appComponent.clientUserComponent.sendRegistrationConfirmationToEmailUseCase,
              registrationByEmailUseCase: appComponent.clientUserComponent.registrationByEmailUseCase,
              validatePasswordUseCase: appComponent.securityComponent.validatePasswordUseCase,
              onBack: () => navigateUp({ to: ClientAuthNavigation.Main.ROUTE }),
              onFinished: () => void navigate({ to: ClientUserNavigation.Main.route, replace: true })
            }}
          />
        </div>
      </div>
    )
  }
})
