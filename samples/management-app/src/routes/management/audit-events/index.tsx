import { createFileRoute } from '@tanstack/react-router'
import { AuditEventListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementAuditEventListParams, ManagementAuditNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/management/audit-events/')({
  validateSearch: (rawSearch) => ManagementAuditEventListParams.parse(rawSearch),
  component: function AuditEventsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <AuditEventListScreen
        dependencies={{
          getAuditEventsUseCase: managementDeps.getAuditEventsUseCase,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            navigate({ search: () => newParams.toQueryMap() as Record<string, unknown> }),
          onNavigateToEventDetail: (eventId) =>
            navigate({ to: '/management/audit-events/$eventId', params: { eventId } }),
          onBack: () => navigateUp({ to: ManagementAuditNavigation.AuditEventList.PARENT_ROUTE })
        }}
      />
    )
  }
})

