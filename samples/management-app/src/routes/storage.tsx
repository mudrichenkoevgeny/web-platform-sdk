import { createFileRoute, Outlet } from '@tanstack/react-router'

/** Route configuration for storage section layout outlet. */
export const Route = createFileRoute('/storage')({
  component: () => <Outlet />
})
