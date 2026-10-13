import { createFileRoute } from '@tanstack/react-router'
import { IdentifierDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/profile/identifiers/$identifierId')({
  component: function ProfileIdentifierDetailRoute() {
    const { appComponent } = Route.useRouteContext()
    const { identifierId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <IdentifierDetailScreen
        dependencies={{
          identifierId: toUserIdentifierIdOrThrow(identifierId),
          getUserIdentifierUseCase: appComponent.managementUserComponent.getUserIdentifierUseCase,
          deleteUserIdentifierUseCase: appComponent.managementUserComponent.deleteUserIdentifierUseCase,
          authStorage: appComponent.managementUserComponent.authStorage,
          onNavigateToProfile: () => navigate({ to: '/management/profile' }),
          onNavigateToUserDetail: () => navigate({ to: '/management/profile' }),
          onBack: () => navigateUp({ to: '/management/profile/identifiers' })
        }}
      />
    )
  }
})
