import { createFileRoute, Outlet } from '@tanstack/react-router'

/** Route configuration for self-service storage section layout outlet. */
export const Route = createFileRoute('/self/storage')({
  component: () => <Outlet />
})
