import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon, icons } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  MfaChallengeDialog,
  type MfaChallengeRequest
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { useClientAppComponent } from '@/di/client-app-context'
import { enClientAppStrings } from '@/locales/index'
import { useEnsureHistoryStack } from '@/ui/navigation/use-ensure-history-stack'

export function MainScreen(): React.JSX.Element {
  useEnsureHistoryStack()
  const appComponent = useClientAppComponent()
  const navigate = useNavigate()
  const [mfaRequest, setMfaRequest] = useState<MfaChallengeRequest | null>(null)

  useEffect(() => {
    return appComponent.mfaChallengeHandler.subscribe((req) => {
      setMfaRequest(req)
    })
  }, [appComponent])

  const handleNavClick = () => {
    void navigate({ to: ClientUserNavigation.Main.route, replace: true })
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      <nav className="w-full md:w-64 md:h-full border-r border-border bg-card p-4 flex md:flex-col justify-between items-center md:items-start gap-4">
        <div className="flex md:flex-col w-full gap-2">
          <button
            type="button"
            onClick={handleNavClick}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full',
              'bg-primary text-primary-foreground'
            )}
          >
            <CoreIcon src={icons.user} className="w-5 h-5" />
            <span>{enClientAppStrings.nav_user}</span>
          </button>
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
