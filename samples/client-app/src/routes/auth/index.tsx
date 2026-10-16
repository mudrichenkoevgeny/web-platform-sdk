import { createFileRoute, redirect } from '@tanstack/react-router'
import { ClientAuthNavigation } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/auth/')({
  beforeLoad: () => {
    throw redirect({ to: ClientAuthNavigation.Auth.targetRoute, replace: true })
  }
})
