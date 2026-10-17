import { createFileRoute } from '@tanstack/react-router'
import { IdentifierDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSelfUserNavigation, selfIdentifierListParamsSchema, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for self user identifier detail screen. */
export const Route = createFileRoute('/user/identifiers/$identifierId')({
  component: function UserIdentifierDetailRoute() {
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
          onNavigateToUserMain: () => void navigate({ to: ManagementSelfUserNavigation.Main.route }),
          onNavigateToUserDetail: () => void navigate({ to: ManagementSelfUserNavigation.Main.route }),
          onBack: () =>
            navigateUp({
              to: ManagementSelfUserNavigation.IdentifierList.ROUTE,
              search: (raw) => cleanSearchParams(selfIdentifierListParamsSchema.parse(raw))
            })
        }}
      />
    )
  }
})
