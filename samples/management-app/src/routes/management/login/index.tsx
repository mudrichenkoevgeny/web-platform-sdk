import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ManagementLoginRootScreen,
  managementLoginRootSearchSchema
} from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export const Route = createFileRoute('/management/login/')({
  validateSearch: managementLoginRootSearchSchema,
  component: function ManagementLoginRoute() {
    const { appComponent, loginDependencies } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
      if (!appComponent) {
        return
      }
      return appComponent.managementUserComponent.selfManagementUserRepository.observeCurrentUser((user) => {
        if (user !== null) {
          setIsAuthorized(true)
          void navigate({ to: '/management', replace: true })
        }
      })
    }, [appComponent, navigate])

    if (!loginDependencies || isAuthorized) {
      return null
    }

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative p-4">
          <ManagementLoginRootScreen
            dependencies={loginDependencies}
          />
        </div>
      </div>
    )
  }
})
