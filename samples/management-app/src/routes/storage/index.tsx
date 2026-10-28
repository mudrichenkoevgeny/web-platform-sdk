import { createFileRoute, redirect } from '@tanstack/react-router'
import { ManagementStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration redirecting storage root path to storage file list. */
export const Route = createFileRoute('/storage/')({
  beforeLoad: () => {
    throw redirect({ to: ManagementStorageNavigation.Main.targetRoute, replace: true })
  }
})
