import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { ManagementAuthNavigation, ManagementMainNavigation, ManagementSelfUserNavigation, type UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  MfaChallengeDialog,
  type MfaChallengeRequest
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useManagementAppComponent } from '@/di/management-app-context'
import { getDestinations, type MainTabKey } from '@/ui/screen/main/main-screen-destination'

export function MainScreen(): React.JSX.Element {
  const appComponent = useManagementAppComponent()
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [mfaRequest, setMfaRequest] = useState<MfaChallengeRequest | null>(null)

  const activeTab: MainTabKey = useMemo(() => {
    if (location.pathname.startsWith(ManagementSelfUserNavigation.Main.route)) {
      return 'user'
    }
    return 'management'
  }, [location.pathname])

  useEffect(() => {
    return appComponent.managementUserComponent.selfManagementUserRepository.observeCurrentUser((user: UserPrivate | null) => {
      const authorized = user !== null
      setIsAuthorized(authorized)
      if (!authorized && location.pathname !== ManagementAuthNavigation.Main.ROUTE && !location.pathname.startsWith(ManagementAuthNavigation.Main.ROUTE)) {
        void navigate({ to: ManagementAuthNavigation.Main.ROUTE, replace: true })
      }
    })
  }, [appComponent, location.pathname, navigate])

  useEffect(() => {
    return appComponent.mfaChallengeHandler.subscribe((req) => {
      setMfaRequest(req)
    })
  }, [appComponent])

  const destinations = useMemo(() => getDestinations(isAuthorized), [isAuthorized])

  const handleTabClick = (tabKey: MainTabKey) => {
    if (!isAuthorized) {
      void navigate({ to: ManagementAuthNavigation.Main.ROUTE, replace: true })
      return
    }
    if (tabKey === 'management') {
      void navigate({ to: ManagementMainNavigation.Main.route, replace: true })
    } else if (tabKey === 'user') {
      void navigate({ to: ManagementSelfUserNavigation.Main.route, replace: true })
    }
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      <nav className="w-full md:w-64 md:h-full border-r border-border bg-card p-4 flex md:flex-col justify-between items-center md:items-start gap-4">
        <div className="flex md:flex-col w-full gap-2">
          {destinations.map((dest) => {
            const isActive = activeTab === dest.key
            return (
              <button
                key={dest.key}
                type="button"
                onClick={() => handleTabClick(dest.key)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <CoreIcon src={dest.Icon} className="w-5 h-5" />
                <span>{dest.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <main className="flex-1 h-full overflow-auto relative">
        <Outlet />
      </main>

      {mfaRequest && (
        <MfaChallengeDialog
          request={mfaRequest}
          onConfirm={(code) => appComponent.mfaChallengeHandler.onConfirm(code)}
          onCancel={() => appComponent.mfaChallengeHandler.onCancel()}
        />
      )}
    </div>
  )
}
