import { createFileRoute, redirect } from '@tanstack/react-router'
import { ManagementStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'

const toRoutePath = (route: string): string =>
  route.startsWith('$') ? route.slice(1) : route

/** Route configuration redirecting storage root path to storage file list. */
export const Route = createFileRoute('/storage/')({
  beforeLoad: () => {
    throw redirect({ to: toRoutePath(ManagementStorageNavigation.Main.targetRoute), replace: true })
  }
})
