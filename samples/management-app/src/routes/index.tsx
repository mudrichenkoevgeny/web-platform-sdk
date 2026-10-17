import { createFileRoute } from '@tanstack/react-router'
import { MainManagementScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import {
  ManagementAuditNavigation,
  ManagementUsersNavigation
} from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration for main administrative dashboard screen. */
export const Route = createFileRoute('/')({
  component: function MainManagementRoute() {
    const navigate = Route.useNavigate()

    return (
      <MainManagementScreen
        dependencies={{
          onSettingsClick: () => void navigate({ to: '/settings' }),
          onGlobalUserListClick: () => void navigate({ to: ManagementUsersNavigation.UserList.ROUTE }),
          onAuditEventListClick: () => void navigate({ to: ManagementAuditNavigation.AuditEventList.ROUTE }),
          onGlobalSessionListClick: () => void navigate({ to: ManagementUsersNavigation.GlobalSessionList.ROUTE }),
          onGlobalIdentifierListClick: () => void navigate({ to: ManagementUsersNavigation.GlobalIdentifierList.ROUTE })
        }}
      />
    )
  }
})
