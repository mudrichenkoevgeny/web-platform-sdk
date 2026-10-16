import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/auth')({
  beforeLoad: async ({ context }) => {
    const user = await context.appComponent.clientUserComponent.userStorage.getCurrentUser()
    if (user) {
      throw redirect({ to: ClientUserNavigation.Main.route, replace: true })
    }
  },
  component: () => <Outlet />
})
