import React, { useEffect, useState } from 'react'
import { SdkProvider, ThemeProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAppComponent } from '@/di/management-app-component'
import { ManagementAppComponentProvider } from '@/di/management-app-context'
import { MainScreen } from '@/ui/screen/main/MainScreen'
import { InitialLoader } from '@/ui/screen/loader/InitialLoader'

export interface RootContentProps {
  readonly managementAppComponent: ManagementAppComponent
}

/**
 * Top-level sample UI: shows {@link InitialLoader} until {@link ManagementAppComponent.isInitialized},
 * then provides providers and displays {@link MainScreen}.
 */
export function RootContent({ managementAppComponent }: RootContentProps): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(managementAppComponent.isInitialized)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      managementAppComponent.init()
      await managementAppComponent.syncManagementDataUseCase.invoke()
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
  }, [managementAppComponent, isInitialized])

  if (!isInitialized) {
    return <InitialLoader />
  }

  return (
    <SdkProvider component={managementAppComponent.commonComponent}>
      <ManagementAppComponentProvider component={managementAppComponent}>
        <ThemeProvider>
          <MainScreen />
        </ThemeProvider>
      </ManagementAppComponentProvider>
    </SdkProvider>
  )
}
