import { createFileRoute, redirect } from '@tanstack/react-router'
import { ManagementSelfStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'

/** Route configuration redirecting self storage root path to self storage file list. */
export const Route = createFileRoute('/self/storage/')({
  beforeLoad: () => {
    throw redirect({ to: ManagementSelfStorageNavigation.Main.targetRoute, replace: true })
  }
})
