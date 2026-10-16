import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/auth')({
  beforeLoad: async ({ context }) => {
    const user = await context.appComponent.managementUserComponent.userStorage.getCurrentUser()
    if (user) {
      throw redirect({ to: ManagementSelfUserNavigation.Main.route, replace: true })
    }
  },
  component: () => <Outlet />
})
