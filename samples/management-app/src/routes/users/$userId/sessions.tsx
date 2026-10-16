import { createFileRoute } from '@tanstack/react-router'
import { UserSessionListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { managementUserSessionListParamsSchema, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/users/$userId/sessions')({
  validateSearch: (rawSearch) => managementUserSessionListParamsSchema.parse(rawSearch),
  component: function UserSessionListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { userId } = Route.useParams()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!managementDeps) {
      return null
    }

    return (
      <UserSessionListScreen
        dependencies={{
          userId: toUserIdOrThrow(userId),
          managementGetSessionsUseCase: managementDeps.managementGetSessionsUseCase,
          managementDeleteSessionUseCase: managementDeps.managementDeleteSessionUseCase,
          managementDeleteAllUserSessionsUseCase: managementDeps.managementDeleteAllUserSessionsUseCase,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToSessionDetail: (session) =>
            session.id && navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id } }),
          onBack: () => navigateUp({ to: '/users/$userId', params: { userId } })
        }}
      />
    )
  }
})
