import { createFileRoute, redirect } from '@tanstack/react-router'
import { ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: ClientUserNavigation.Main.route })
  }
})
