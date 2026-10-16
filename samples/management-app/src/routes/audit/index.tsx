import { createFileRoute, redirect } from '@tanstack/react-router'
import { ManagementAuditNavigation } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/audit/')({
  beforeLoad: () => {
    throw redirect({ to: ManagementAuditNavigation.Main.targetRoute, replace: true })
  }
})
