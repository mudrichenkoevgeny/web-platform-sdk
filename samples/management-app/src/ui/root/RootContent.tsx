import React, { useEffect, useMemo, useState } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { type UserId } from '@mudrichenkoevgeny/shared-foundation'
import { SdkProvider, ThemeProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import type { ManagementAppComponent } from '@/di/management-app-component'
import { ManagementAppComponentProvider } from '@/di/management-app-context'
import { InitialLoader } from '@/ui/screen/loader/InitialLoader'
import { router } from '@/router'

export interface RootContentProps {
  readonly managementAppComponent: ManagementAppComponent
}

/**
 * Top-level sample UI: initializes SDK services, fetches user configuration, connects WebSockets,
 * then displays {@link MainScreen}.
 */
export function RootContent({ managementAppComponent }: RootContentProps): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(managementAppComponent.isInitialized)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      managementAppComponent.init()
      await managementAppComponent.refreshManagementUserConfigurationUseCase.execute()
      managementAppComponent.commonComponent.webSocketService.connect()
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

  const [currentUserId, setCurrentUserId] = useState<UserId | null>(null)

  useEffect(() => {
    return managementAppComponent.managementUserComponent.selfManagementUserRepository.observeCurrentUser((user) => {
      setCurrentUserId(user?.id ?? null)
    })
  }, [managementAppComponent])

  const managementDependencies: ManagementRootStoreDependencies = useMemo(
    () => ({
      currentUserId,
      getManagementAuthSettingsUseCase: managementAppComponent.managementUserComponent.getManagementAuthSettingsUseCase,
      updateManagementAuthSettingsUseCase: managementAppComponent.managementUserComponent.updateManagementAuthSettingsUseCase,
      resetManagementAuthSettingsUseCase: managementAppComponent.managementUserComponent.resetManagementAuthSettingsUseCase,
      getManagementGlobalSettingsUseCase: managementAppComponent.managementUserComponent.getManagementGlobalSettingsUseCase,
      updateManagementGlobalSettingsUseCase: managementAppComponent.managementUserComponent.updateManagementGlobalSettingsUseCase,
      resetManagementGlobalSettingsUseCase: managementAppComponent.managementUserComponent.resetManagementGlobalSettingsUseCase,
      getManagementSecuritySettingsUseCase: managementAppComponent.managementUserComponent.getManagementSecuritySettingsUseCase,
      updateManagementSecuritySettingsUseCase: managementAppComponent.managementUserComponent.updateManagementSecuritySettingsUseCase,
      resetManagementSecuritySettingsUseCase: managementAppComponent.managementUserComponent.resetManagementSecuritySettingsUseCase,
      getManagementStorageSettingsUseCase: managementAppComponent.managementUserComponent.getManagementStorageSettingsUseCase,
      updateManagementStorageSettingsUseCase: managementAppComponent.managementUserComponent.updateManagementStorageSettingsUseCase,
      resetManagementStorageSettingsUseCase: managementAppComponent.managementUserComponent.resetManagementStorageSettingsUseCase,
      managementGetFilesUseCase: managementAppComponent.managementUserComponent.managementGetFilesUseCase,
      managementGetFileDetailUseCase: managementAppComponent.managementUserComponent.managementGetFileDetailUseCase,
      managementDeleteFileUseCase: managementAppComponent.managementUserComponent.managementDeleteFileUseCase,
      managementDeleteFilesBatchUseCase: managementAppComponent.managementUserComponent.managementDeleteFilesBatchUseCase,
      getUsersUseCase: managementAppComponent.managementUserComponent.getUsersUseCase,
      getUserUseCase: managementAppComponent.managementUserComponent.getUserUseCase,
      createUserUseCase: managementAppComponent.managementUserComponent.createUserUseCase,
      updateUserUseCase: managementAppComponent.managementUserComponent.updateUserUseCase,
      deleteUserUseCase: managementAppComponent.managementUserComponent.deleteUserUseCase,
      managementGetSessionsUseCase: managementAppComponent.managementUserComponent.managementGetSessionsUseCase,
      managementGetSessionUseCase: managementAppComponent.managementUserComponent.managementGetSessionUseCase,
      managementGetIdentifiersUseCase: managementAppComponent.managementUserComponent.managementGetIdentifiersUseCase,
      managementGetIdentifierUseCase: managementAppComponent.managementUserComponent.managementGetIdentifierUseCase,
      managementDisableTotpUseCase: managementAppComponent.managementUserComponent.managementDisableTotpUseCase,
      managementDeleteSessionUseCase: managementAppComponent.managementUserComponent.managementDeleteSessionUseCase,
      managementDeleteAllUserSessionsUseCase: managementAppComponent.managementUserComponent.managementDeleteAllUserSessionsUseCase,
      managementDeleteIdentifierUseCase: managementAppComponent.managementUserComponent.managementDeleteIdentifierUseCase,
      managementDeleteIdentifierPasswordUseCase: managementAppComponent.managementUserComponent.managementDeleteIdentifierPasswordUseCase,
      getAuditEventsUseCase: managementAppComponent.managementUserComponent.getAuditEventsUseCase,
      getAuditEventUseCase: managementAppComponent.managementUserComponent.getAuditEventUseCase,
      selfManagementUserRepository: managementAppComponent.managementUserComponent.selfManagementUserRepository
    }),
    [managementAppComponent, currentUserId]
  )

  if (!isInitialized) {
    return <InitialLoader />
  }

  return (
    <SdkProvider component={managementAppComponent.commonComponent}>
      <ManagementAppComponentProvider component={managementAppComponent}>
        <ThemeProvider>
          <RouterProvider
            router={router}
            context={{
              appComponent: managementAppComponent,
              managementDeps: managementDependencies
            }}
          />
        </ThemeProvider>
      </ManagementAppComponentProvider>
    </SdkProvider>
  )
}
