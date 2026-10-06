import React, { useEffect, useState } from 'react'
import { SdkProvider, ThemeProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ClientAppComponent } from '@/di/client-app-component'
import { ClientAppComponentProvider } from '@/di/client-app-context'
import { MainScreen } from '@/ui/screen/main/MainScreen'
import { InitialLoader } from '@/ui/screen/loader/InitialLoader'

export interface RootContentProps {
  readonly clientAppComponent: ClientAppComponent
}

/**
 * Top-level sample UI: initializes SDK services, fetches user configuration, connects WebSockets,
 * then displays {@link MainScreen}.
 */
export function RootContent({ clientAppComponent }: RootContentProps): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(clientAppComponent.isInitialized)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      clientAppComponent.init()
      await clientAppComponent.refreshUserConfigurationUseCase.execute()
      clientAppComponent.commonComponent.webSocketService.connect()
      if (isMounted) {
        setIsInitialized(true)
      }
    }

    if (!isInitialized) {
      void initialize()
    }

    return () => {
      isMounted = false
    }
  }, [clientAppComponent, isInitialized])

  if (!isInitialized) {
    return <InitialLoader />
  }

  return (
    <SdkProvider component={clientAppComponent.commonComponent}>
      <ClientAppComponentProvider component={clientAppComponent}>
        <ThemeProvider>
          <MainScreen />
        </ThemeProvider>
      </ClientAppComponentProvider>
    </SdkProvider>
  )
}
