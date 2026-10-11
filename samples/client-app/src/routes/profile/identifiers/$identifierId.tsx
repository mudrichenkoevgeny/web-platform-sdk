import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { IdentifierDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'

export const Route = createFileRoute('/profile/identifiers/$identifierId')({
  component: function ProfileIdentifierDetailRoute() {
    const { appComponent } = Route.useRouteContext()
    const { identifierId } = Route.useParams()
    const navigate = Route.useNavigate()

    if (!appComponent) {
      return null
    }

    return (
      <IdentifierDetailScreen
        dependencies={{
          identifierId: identifierId as UserIdentifierId,
          getUserIdentifierUseCase: appComponent.clientUserComponent.getUserIdentifierUseCase,
          deleteUserIdentifierUseCase: appComponent.clientUserComponent.deleteUserIdentifierUseCase,
          emailChangePasswordUseCase: appComponent.clientUserComponent.emailChangePasswordUseCase,
          authStorage: appComponent.clientUserComponent.authStorage,
          onNavigateToProfile: () => navigate({ to: '/profile' }),
          onNavigateToUserDetail: () => navigate({ to: '/profile' }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
