import { createFileRoute, redirect } from '@tanstack/react-router'
import { ManagementAuditNavigation } from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration redirecting audit root path to audit event list. */
export const Route = createFileRoute('/audit/')({
  beforeLoad: () => {
    throw redirect({ to: ManagementAuditNavigation.Main.targetRoute, replace: true })
  }
})
