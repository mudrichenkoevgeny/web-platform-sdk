import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GlobalIdentifierListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/identifiers/')({
  component: function GlobalIdentifierListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <GlobalIdentifierListScreen
        dependencies={{
          managementGetIdentifiersUseCase: managementDeps.managementGetIdentifiersUseCase,
          managementDeleteIdentifierUseCase: managementDeps.managementDeleteIdentifierUseCase,
          onNavigateToIdentifierDetail: (identifierId) =>
            navigate({ to: '/management/identifiers/$identifierId', params: { identifierId } }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
