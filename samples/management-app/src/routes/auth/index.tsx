import { createFileRoute, redirect } from '@tanstack/react-router'
import { ManagementAuthNavigation } from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration redirecting auth root path to login. */
export const Route = createFileRoute('/auth/')({
  beforeLoad: () => {
    throw redirect({ to: ManagementAuthNavigation.Auth.targetRoute, replace: true })
  }
})
