import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/management/settings/')({
  component: function SettingsIndexRoute() {
    return <Navigate replace to="/management/settings/global" />
  }
})
