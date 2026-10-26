import { createFileRoute } from '@tanstack/react-router'
import { MainManagementScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import {
  ManagementAuditNavigation,
  ManagementUsersNavigation,
  ManagementStorageNavigation
} from '@mudrichenkoevgeny/shared-foundation'

const toRoutePath = (route: string): string =>
  route.startsWith('$') ? route.slice(1) : route

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
          onGlobalIdentifierListClick: () => void navigate({ to: ManagementUsersNavigation.GlobalIdentifierList.ROUTE }),
          onStorageFileListClick: () => void navigate({ to: toRoutePath(ManagementStorageNavigation.FileList.ROUTE) })
        }}
      />
    )
  }
})
