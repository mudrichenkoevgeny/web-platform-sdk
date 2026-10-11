import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { EditGlobalSettingsScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/settings/global')({
  component: function EditGlobalSettingsRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <EditGlobalSettingsScreen
        dependencies={{
          getManagementGlobalSettingsUseCase: managementDeps.getManagementGlobalSettingsUseCase,
          saveRemoteGlobalSettingsUseCase: managementDeps.saveRemoteGlobalSettingsUseCase,
          resetRemoteGlobalSettingsUseCase: managementDeps.resetRemoteGlobalSettingsUseCase,
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
