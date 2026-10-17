import { createFileRoute, Outlet } from '@tanstack/react-router'

/** Route configuration for audit section layout outlet. */
export const Route = createFileRoute('/audit')({
  component: () => <Outlet />
})
