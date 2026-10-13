import { createFileRoute } from '@tanstack/react-router'
import { AuditEventDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementAuditNavigation, toAuditEventIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/audit-events/$eventId')({
  component: function AuditEventDetailRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { eventId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!managementDeps) {
      return null
    }

    return (
      <AuditEventDetailScreen
        dependencies={{
          eventId: toAuditEventIdOrThrow(eventId),
          getAuditEventUseCase: managementDeps.getAuditEventUseCase,
          currentUserId: managementDeps.currentUserId,
          onNavigateToUserDetail: (userId) =>
            navigate({ to: '/management/users/$userId', params: { userId } }),
          onNavigateToSessionDetail: (sessionId) =>
            navigate({ to: '/management/sessions/$sessionId', params: { sessionId } }),
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/management/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToProfile: () => navigate({ to: '/management/profile' }),
          onBack: () => navigateUp({ to: ManagementAuditNavigation.AuditEventDetail.PARENT_ROUTE })
        }}
      />
    )
  }
})

