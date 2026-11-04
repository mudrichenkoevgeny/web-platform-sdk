import { createFileRoute } from '@tanstack/react-router'
import { IdentifierDetailScreen, createSelfIdentifierDetailDataSource } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation, selfIdentifierListParamsSchema, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
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
          identifierId: toUserIdentifierIdOrThrow(identifierId),
          dataSource: createSelfIdentifierDetailDataSource({
            getIdentifierUseCase: appComponent.clientUserComponent.getUserIdentifierUseCase,
            deleteIdentifierUseCase: appComponent.clientUserComponent.deleteUserIdentifierUseCase,
            changePasswordUseCase: appComponent.clientUserComponent.emailChangePasswordUseCase
          }),
          authStorage: appComponent.clientUserComponent.authStorage,
          onNavigateToUserMain: () => void navigate({ to: ClientUserNavigation.Main.route }),
          onNavigateToUserDetail: () => void navigate({ to: ClientUserNavigation.Main.route }),
          onBack: () =>
            void navigateUp({
              to: ClientUserNavigation.IdentifierList.ROUTE,
              search: (raw) => cleanSearchParams(selfIdentifierListParamsSchema.parse(raw))
            })
        }}
      />
    )
  }
})
