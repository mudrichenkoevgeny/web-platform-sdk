import React, { forwardRef } from 'react'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreButton, CoreScreenTitleText } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  MainManagementProvider,
  useMainManagementStore
} from '@/ui/screens/management/main/MainManagementStore'
import type { MainManagementStoreDependencies } from '@/ui/screens/management/main/MainManagementStore'

const defaultUserStrings = new UserModuleStrings()

const MainManagementContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = defaultUserStrings
}) => {
  const onSettingsClick = useMainManagementStore((s) => s.onSettingsClick)
  const onGlobalUserListClick = useMainManagementStore((s) => s.onGlobalUserListClick)
  const onAuditEventListClick = useMainManagementStore((s) => s.onAuditEventListClick)
  const onGlobalSessionListClick = useMainManagementStore((s) => s.onGlobalSessionListClick)
  const onGlobalIdentifierListClick = useMainManagementStore((s) => s.onGlobalIdentifierListClick)

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
}

export const MainManagementScreen = forwardRef<HTMLDivElement, MainManagementScreenProps>(
  ({ dependencies, strings = defaultUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <MainManagementProvider dependencies={dependencies}>
          <MainManagementContent strings={strings} />
        </MainManagementProvider>
      </div>
    )
  }
)

MainManagementScreen.displayName = 'MainManagementScreen'
