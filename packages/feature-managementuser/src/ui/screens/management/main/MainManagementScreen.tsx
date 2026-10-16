import React, { forwardRef } from 'react'
import { cn, CoreButton, CoreScreenTitleText } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import {
  MainManagementProvider,
  useMainManagementStore
} from '@/ui/screens/management/main/MainManagementStore'
import type { MainManagementStoreDependencies } from '@/ui/screens/management/main/MainManagementStore'

const MainManagementContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
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
          text={strings.management_settings_title}
          className="mx-auto"
        />
      </div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-4">
        <CoreButton
          type="button"
          label={strings.users_management}
          onClick={onGlobalUserListClick}
        />
        <CoreButton
          type="button"
          label={strings.sessions}
          onClick={onGlobalSessionListClick}
        />
        <CoreButton
          type="button"
          label={strings.identifiers}
          onClick={onGlobalIdentifierListClick}
        />
        <CoreButton
          type="button"
          label={strings.audit_logs}
          onClick={onAuditEventListClick}
        />
        <CoreButton
          type="button"
          label={strings.settings}
          onClick={onSettingsClick}
        />
      </div>
    </div>
  )
}

export interface MainManagementScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: MainManagementStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const MainManagementScreen = forwardRef<HTMLDivElement, MainManagementScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
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
