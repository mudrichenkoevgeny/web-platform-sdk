import { createFileRoute } from '@tanstack/react-router'
import { IdentifierDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation, selfIdentifierListParamsSchema, type UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/user/identifiers/$identifierId')({
  component: function UserIdentifierDetailRoute() {
    const { appComponent } = Route.useRouteContext()
    const { identifierId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    return (
      <IdentifierDetailScreen
        dependencies={{
          identifierId: identifierId as UserIdentifierId,
          getUserIdentifierUseCase: appComponent.clientUserComponent.getUserIdentifierUseCase,
          deleteUserIdentifierUseCase: appComponent.clientUserComponent.deleteUserIdentifierUseCase,
          emailChangePasswordUseCase: appComponent.clientUserComponent.emailChangePasswordUseCase,
          authStorage: appComponent.clientUserComponent.authStorage,
          onNavigateToUserMain: () => navigate({ to: ClientUserNavigation.Main.route }),
          onNavigateToUserDetail: () => navigate({ to: ClientUserNavigation.Main.route }),
          onBack: () =>
            navigateUp({
              to: ClientUserNavigation.IdentifierList.ROUTE,
              search: (raw) => cleanSearchParams(selfIdentifierListParamsSchema.parse(raw))
            })
        }}
      />
    )
  }
})
