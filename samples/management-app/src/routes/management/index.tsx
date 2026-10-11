import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MainManagementScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/')({
  component: function MainManagementRoute() {
    const navigate = Route.useNavigate()

    return (
      <MainManagementScreen
        dependencies={{
          onEditAuthSettingsClick: () => navigate({ to: '/management/settings/auth' }),
          onEditGlobalSettingsClick: () => navigate({ to: '/management/settings/global' }),
          onEditSecuritySettingsClick: () => navigate({ to: '/management/settings/security' }),
          onGlobalUserListClick: () => navigate({ to: '/management/users' }),
          onAuditEventListClick: () => navigate({ to: '/management/audit-events' }),
          onGlobalSessionListClick: () => navigate({ to: '/management/sessions' }),
          onGlobalIdentifierListClick: () => navigate({ to: '/management/identifiers' })
        }}
      />
    )
  }
})
