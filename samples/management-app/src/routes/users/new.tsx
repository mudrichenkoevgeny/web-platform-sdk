import { createFileRoute } from '@tanstack/react-router'
import { CreateUserScreen, globalUserListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementUsersNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for create new user account screen. */
export const Route = createFileRoute('/users/new')({
  component: function CreateUserRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <CreateUserScreen
        dependencies={{
          createUserUseCase: managementDeps.createUserUseCase,
          onSuccess: () => navigateUp({ to: ManagementUsersNavigation.CreateUser.parentRoute, search: (raw) => cleanSearchParams(globalUserListSearchSchema.parse(raw)) }),
          onBack: () => navigateUp({ to: ManagementUsersNavigation.CreateUser.parentRoute, search: (raw) => cleanSearchParams(globalUserListSearchSchema.parse(raw)) })
        }}
      />
    )
  }
})
