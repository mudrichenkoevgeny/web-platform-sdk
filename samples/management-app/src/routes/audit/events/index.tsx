import { createFileRoute } from '@tanstack/react-router'
import { AuditEventListScreen, auditEventListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementMainNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/audit/events/')({
  validateSearch: (rawSearch) => parseSearchParams(auditEventListSearchSchema, rawSearch),
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
            void navigate({ search: (prev) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToEventDetail: (eventId) =>
            void navigate({ to: '/audit/events/$eventId', params: { eventId } }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})
