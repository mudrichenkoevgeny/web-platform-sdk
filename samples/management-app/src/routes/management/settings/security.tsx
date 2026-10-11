import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { EditSecuritySettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/settings/security')({
  component: function EditSecuritySettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <EditSecuritySettingsScreen
        dependencies={{
          getManagementSecuritySettingsUseCase: managementDeps.getManagementSecuritySettingsUseCase,
          saveRemoteSecuritySettingsUseCase: managementDeps.saveRemoteSecuritySettingsUseCase,
          resetRemoteSecuritySettingsUseCase: managementDeps.resetRemoteSecuritySettingsUseCase,
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
