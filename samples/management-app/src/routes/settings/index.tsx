import { createFileRoute } from '@tanstack/react-router'
import { MainManagementScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import {
  ManagementAuditNavigation,
  ManagementAuthSettingsNavigation,
  ManagementSecurityNavigation,
  ManagementSettingsNavigation,
  ManagementUsersNavigation
} from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/settings/')({
  component: function SettingsMainRoute() {
    const navigate = Route.useNavigate()

    return (
      <MainManagementScreen
        dependencies={{
          onEditAuthSettingsClick: () => navigate({ to: ManagementAuthSettingsNavigation.AuthSettings.route }),
          onEditGlobalSettingsClick: () => navigate({ to: ManagementSettingsNavigation.GlobalSettings.route }),
          onEditSecuritySettingsClick: () => navigate({ to: ManagementSecurityNavigation.SecuritySettings.route }),
          onGlobalUserListClick: () => navigate({ to: ManagementUsersNavigation.UserList.ROUTE, search: (prev: Record<string, unknown>) => prev }),
          onAuditEventListClick: () => navigate({ to: ManagementAuditNavigation.AuditEventList.ROUTE, search: (prev: Record<string, unknown>) => prev }),
          onGlobalSessionListClick: () => navigate({ to: ManagementUsersNavigation.GlobalSessionList.ROUTE, search: (prev: Record<string, unknown>) => prev }),
          onGlobalIdentifierListClick: () => navigate({ to: ManagementUsersNavigation.GlobalIdentifierList.ROUTE, search: (prev: Record<string, unknown>) => prev })
        }}
      />
    )
  }
})
