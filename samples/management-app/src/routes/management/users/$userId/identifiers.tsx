import { createFileRoute } from '@tanstack/react-router'
import { UserIdentifierListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/users/$userId/identifiers')({
  component: function UserIdentifierListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { userId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!managementDeps) {
      return null
    }

    return (
      <UserIdentifierListScreen
        dependencies={{
          userId: toUserIdOrThrow(userId),
          managementGetIdentifiersUseCase: managementDeps.managementGetIdentifiersUseCase,
          onIdentifierSelect: (identifierId) =>
            navigate({ to: '/management/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigateUp({ to: '/management/users/$userId', params: { userId } })
        }}
      />
    )
  }
})
