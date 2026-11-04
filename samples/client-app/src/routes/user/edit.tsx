import { createFileRoute } from '@tanstack/react-router'
import {
  UserEditScreen,
  ValidateNicknameUseCase,
  ValidateDisplayNameUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for user profile edit screen. */
export const Route = createFileRoute('/user/edit')({
  component: function UserEditRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    const validateNicknameUseCase = new ValidateNicknameUseCase(appComponent.clientUserComponent.getAuthSettingsUseCase)
    const validateDisplayNameUseCase = new ValidateDisplayNameUseCase(appComponent.clientUserComponent.getAuthSettingsUseCase)

    return (
      <UserEditScreen
        dependencies={{
          getUserUseCase: appComponent.clientUserComponent.getUserUseCase,
          selfUpdateUserUseCase: appComponent.clientUserComponent.selfUpdateUserUseCase,
          validateNicknameUseCase,
          validateDisplayNameUseCase,
          onSuccess: () => void navigateUp({ to: ClientUserNavigation.Main.route }),
          onBack: () => void navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})
