import { createFileRoute } from '@tanstack/react-router'
import {
  ManagementAuthSettingsNavigation,
  ManagementSecurityNavigation,
  ManagementSettingsNavigation,
  ManagementStorageSettingsNavigation,
  storageStrings,
  userStrings
} from '@mudrichenkoevgeny/shared-foundation'
import { CoreBackButton, CoreButton, CoreScreenTitleText } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for administrative settings main hub screen. */
export const Route = createFileRoute('/settings/')({
  component: function ManagementSettingsRoute() {
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
        <div className="w-full flex items-center justify-between relative mb-6">
          <CoreBackButton onClick={() => navigateUp({ to: '/' })} />
          <CoreScreenTitleText
            text={userStrings.ui.settings}
            className="absolute left-1/2 -translate-x-1/2"
          />
          <div className="w-10" />
        </div>

        <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-4 justify-center">
          <CoreButton
            type="button"
            label={userStrings.ui.editAuthSettings}
            onClick={() => void navigate({ to: ManagementAuthSettingsNavigation.AuthSettings.route })}
          />
          <CoreButton
            type="button"
            label={userStrings.ui.editGlobalSettings}
            onClick={() => void navigate({ to: ManagementSettingsNavigation.GlobalSettings.route })}
          />
          <CoreButton
            type="button"
            label={userStrings.ui.editSecuritySettings}
            onClick={() => void navigate({ to: ManagementSecurityNavigation.SecuritySettings.route })}
          />
          <CoreButton
            type="button"
            label={storageStrings.ui.storageSettingsTitle ?? 'Storage Settings'}
            onClick={() => void navigate({ to: ManagementStorageSettingsNavigation.StorageSettings.route })}
          />
        </div>
      </div>
    )
  }
})
