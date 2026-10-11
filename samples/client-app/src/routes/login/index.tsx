import React, { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ClientLoginRootScreen,
  clientLoginRootSearchSchema
} from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'

export const Route = createFileRoute('/login/')({
  validateSearch: clientLoginRootSearchSchema,
  component: function ClientLoginRoute() {
    const { appComponent, loginDependencies } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const search = Route.useSearch()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
      if (!appComponent) {
        return
      }
      return appComponent.clientUserComponent.userRepository.observeCurrentUser((user) => {
        if (user !== null) {
          setIsAuthorized(true)
          void navigate({ to: '/profile', replace: true })
        }
      })
    }, [appComponent, navigate])

    if (!loginDependencies || isAuthorized) {
      return null
    }

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <ClientLoginRootScreen
            dependencies={{
              ...loginDependencies,
              loginStep: search.loginStep,
              onStepChange: (step) =>
                void navigate({ search: (prev) => ({ ...prev, loginStep: step }) })
            }}
          />
        </div>
      </div>
    )
  }
})
