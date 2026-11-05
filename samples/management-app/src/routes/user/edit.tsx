import { createFileRoute } from '@tanstack/react-router'
import {
  UserEditScreen,
  GetUserUseCase,
  SelfUpdateUserUseCase,
  ValidateNicknameUseCase,
  ValidateDisplayNameUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for self user profile edit screen in management app. */
export const Route = createFileRoute('/user/edit')({
  component: function UserEditRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    const selfUserRepository = appComponent.managementUserComponent.selfUserRepository
    const getUserUseCase = new GetUserUseCase(selfUserRepository)
    const selfUpdateUserUseCase = new SelfUpdateUserUseCase(selfUserRepository)
    const authSettingsAdapter = {
      execute: async () => {
        const res = await appComponent.managementUserComponent.getManagementAuthSettingsUseCase.execute()
        return res
      }
    }
    const validateNicknameUseCase = new ValidateNicknameUseCase(authSettingsAdapter as never)
    const validateDisplayNameUseCase = new ValidateDisplayNameUseCase(authSettingsAdapter as never)

    return (
      <UserEditScreen
        dependencies={{
          getUserUseCase,
          selfUpdateUserUseCase,
          validateNicknameUseCase,
          validateDisplayNameUseCase,
          uploadFileUseCase: appComponent.managementUserComponent.selfManagementUploadFileUseCase,
          onSuccess: () => void navigateUp({ to: ManagementSelfUserNavigation.Main.route }),
          onBack: () => void navigateUp({ to: ManagementSelfUserNavigation.Main.route })
        }}
      />
    )
  }
})
