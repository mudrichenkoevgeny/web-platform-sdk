import { createFileRoute } from '@tanstack/react-router'
import { ClientAuthNavigation, type AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockRootScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'
import { z } from 'zod'

const searchSchema = z.object({
  lockoutType: z.string().optional(),
  lockoutUntil: z.number().optional()
})

export const Route = createFileRoute('/auth/unlock/')({
  validateSearch: searchSchema,
  beforeLoad: () => {
    // Auth guard is handled at RootContent level
  },
  component: function ClientUnlockRoute() {
    const { appComponent } = Route.useRouteContext()
    const { lockoutType, lockoutUntil } = Route.useSearch()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <UnlockRootScreen
            dependencies={{
              lockoutType: (lockoutType as AccountLockoutType) ?? null,
              lockoutUntil: lockoutUntil ?? null,
              getUserIdentifiersUseCase: appComponent.clientUserComponent.getUserIdentifiersUseCase,
              unlockByGoogleUseCase: appComponent.clientUserComponent.unlockByGoogleUseCase,
              sendUnlockEmailConfirmationUseCase: appComponent.clientUserComponent.sendUnlockEmailConfirmationUseCase,
              sendUnlockPhoneConfirmationUseCase: appComponent.clientUserComponent.sendUnlockPhoneConfirmationUseCase,
              unlockByEmailUseCase: appComponent.clientUserComponent.unlockByEmailUseCase,
              unlockByPhoneUseCase: appComponent.clientUserComponent.unlockByPhoneUseCase,
              onUnlockSuccess: () => navigateUp({ to: ClientAuthNavigation.Main.ROUTE }),
              onBack: () => navigateUp({ to: ClientAuthNavigation.Main.ROUTE })
            }}
          />
        </div>
      </div>
    )
  }
})
