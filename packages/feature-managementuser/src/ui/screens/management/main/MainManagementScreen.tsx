import React, { forwardRef } from 'react'
import { UserModuleStrings, StorageModuleStrings, userStrings, storageStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreButton, CoreScreenTitleText } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  MainManagementProvider,
  useMainManagementStore
} from '@/ui/screens/management/main/MainManagementStore'
import type { MainManagementStoreDependencies } from '@/ui/screens/management/main/MainManagementStore'

const MainManagementContent: React.FC<{
  strings?: UserModuleStrings
  storageUiStrings?: StorageModuleStrings
}> = ({
  strings = userStrings,
  storageUiStrings = storageStrings
}) => {
  const onSettingsClick = useMainManagementStore((s) => s.onSettingsClick)
  const onGlobalUserListClick = useMainManagementStore((s) => s.onGlobalUserListClick)
  const onAuditEventListClick = useMainManagementStore((s) => s.onAuditEventListClick)
  const onGlobalSessionListClick = useMainManagementStore((s) => s.onGlobalSessionListClick)
  const onGlobalIdentifierListClick = useMainManagementStore((s) => s.onGlobalIdentifierListClick)
  const onStorageFileListClick = useMainManagementStore((s) => s.onStorageFileListClick)

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-6">
        <CoreScreenTitleText
          text={strings.ui.managementSettingsTitle}
          className="mx-auto"
        />
      </div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-4">
        <CoreButton
          type="button"
          label={strings.ui.usersManagement}
          onClick={onGlobalUserListClick}
        />
        <CoreButton
          type="button"
          label={strings.ui.sessions}
          onClick={onGlobalSessionListClick}
        />
        <CoreButton
          type="button"
          label={strings.ui.identifiers}
          onClick={onGlobalIdentifierListClick}
        />
        <CoreButton
          type="button"
          label={storageUiStrings.ui.storageFileListTitle}
          onClick={onStorageFileListClick}
        />
        <CoreButton
          type="button"
          label={strings.ui.auditLogs}
          onClick={onAuditEventListClick}
        />
        <CoreButton
          type="button"
          label={strings.ui.settings}
          onClick={onSettingsClick}
        />
      </div>
    </div>
  )
}

export interface MainManagementScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: MainManagementStoreDependencies
  strings?: UserModuleStrings
  storageUiStrings?: StorageModuleStrings
}

export const MainManagementScreen = forwardRef<HTMLDivElement, MainManagementScreenProps>(
  ({ dependencies, strings = userStrings, storageUiStrings = storageStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <MainManagementProvider dependencies={dependencies}>
          <MainManagementContent strings={strings} storageUiStrings={storageUiStrings} />
        </MainManagementProvider>
      </div>
    )
  }
)

MainManagementScreen.displayName = 'MainManagementScreen'
