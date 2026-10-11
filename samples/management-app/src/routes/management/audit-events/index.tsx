import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AuditEventListScreen, auditEventListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/audit-events/')({
  validateSearch: auditEventListSearchSchema,
  component: function AuditEventsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <AuditEventListScreen
        dependencies={{
          getAuditEventsUseCase: managementDeps.getAuditEventsUseCase,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            navigate({ search: (old) => ({ ...old, ...newParams }) }),
          onNavigateToEventDetail: (eventId) =>
            navigate({ to: '/management/audit-events/$eventId', params: { eventId } }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
