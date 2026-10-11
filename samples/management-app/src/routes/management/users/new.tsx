import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CreateUserScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/users/new')({
  component: function CreateUserRoute() {
    const { managementDeps } = Route.useRouteContext()
    const navigate = Route.useNavigate()

    return (
      <CreateUserScreen
        dependencies={{
          createUserUseCase: managementDeps.createUserUseCase,
          onSuccess: () => navigate({ to: '..' }),
          onBack: () => navigate({ to: '..' })
        }}
      />
    )
  }
})
