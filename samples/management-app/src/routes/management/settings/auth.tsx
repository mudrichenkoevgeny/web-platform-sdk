import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { EditAuthSettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/settings/auth')({
  component: function EditAuthSettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <EditAuthSettingsScreen
        dependencies={{
          getManagementAuthSettingsUseCase: managementDeps.getManagementAuthSettingsUseCase,
          saveRemoteAuthSettingsUseCase: managementDeps.saveRemoteAuthSettingsUseCase,
          resetRemoteAuthSettingsUseCase: managementDeps.resetRemoteAuthSettingsUseCase,
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
