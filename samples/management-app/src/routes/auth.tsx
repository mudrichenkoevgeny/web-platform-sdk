import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration for authentication section layout. */
export const Route = createFileRoute('/auth')({
  beforeLoad: async ({ context }) => {
    const user = await context.appComponent.managementUserComponent.userStorage.getCurrentUser()
    if (user) {
      throw redirect({ to: ManagementSelfUserNavigation.Main.route, replace: true })
    }
  },
  component: () => <Outlet />
})
