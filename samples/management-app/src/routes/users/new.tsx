import { createFileRoute } from '@tanstack/react-router'
import { CreateUserScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementUsersNavigation, managementUserListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/users/new')({
  component: function CreateUserRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <CreateUserScreen
        dependencies={{
          createUserUseCase: managementDeps.createUserUseCase,
          onSuccess: () => navigateUp({ to: ManagementUsersNavigation.CreateUser.parentRoute, search: (raw) => cleanSearchParams(managementUserListParamsSchema.parse(raw)) }),
          onBack: () => navigateUp({ to: ManagementUsersNavigation.CreateUser.parentRoute, search: (raw) => cleanSearchParams(managementUserListParamsSchema.parse(raw)) })
        }}
      />
    )
  }
})
