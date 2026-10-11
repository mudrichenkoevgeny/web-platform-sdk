import { createFileRoute } from '@tanstack/react-router'
import { CreateUserScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/users/new')({
  component: function CreateUserRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    return (
      <CreateUserScreen
        dependencies={{
          createUserUseCase: managementDeps.createUserUseCase,
          onSuccess: () => navigateUp({ to: '/management/users' }),
          onBack: () => navigateUp({ to: '/management/users' })
        }}
      />
    )
  }
})
