import { createFileRoute, redirect } from '@tanstack/react-router'
import { ManagementAuthNavigation } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/auth/')({
  beforeLoad: () => {
    throw redirect({ to: ManagementAuthNavigation.Auth.targetRoute, replace: true })
  }
})
