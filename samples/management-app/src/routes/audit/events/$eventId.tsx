import { createFileRoute } from '@tanstack/react-router'
import { AuditEventDetailScreen, auditEventListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementAuditNavigation, ManagementSelfUserNavigation, toAuditEventIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { cleanSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/audit/events/$eventId')({
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
            navigate({ to: '/users/$userId', params: { userId } }),
          onNavigateToSessionDetail: (sessionId) =>
            navigate({ to: '/sessions/$sessionId', params: { sessionId } }),
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/identifiers/$identifierId', params: { identifierId } }),
          onNavigateToProfile: () => void navigate({ to: ManagementSelfUserNavigation.Main.route }),
          onBack: () => navigateUp({ to: ManagementAuditNavigation.AuditEventList.ROUTE, search: (raw) => cleanSearchParams(auditEventListSearchSchema.parse(raw)) })
        }}
      />
    )
  }
})
