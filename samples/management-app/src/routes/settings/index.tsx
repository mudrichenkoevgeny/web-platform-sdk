import { createFileRoute } from '@tanstack/react-router'
import {
  ManagementAuthSettingsNavigation,
  ManagementSecurityNavigation,
  ManagementSettingsNavigation
} from '@mudrichenkoevgeny/shared-foundation'
import { CoreBackButton, CoreButton, CoreScreenTitleText } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementAppStrings } from '@/locales/index'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for administrative settings main hub screen. */
export const Route = createFileRoute('/settings/')({
  component: function ManagementSettingsRoute() {
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()
    const strings = enManagementAppStrings

    return (
      <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
        <div className="w-full flex items-center justify-between relative mb-6">
          <CoreBackButton onClick={() => navigateUp({ to: '/' })} />
          <CoreScreenTitleText
            text={strings.nav_settings}
            className="absolute left-1/2 -translate-x-1/2"
          />
          <div className="w-10" />
        </div>

        <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-4 justify-center">
          <CoreButton
            type="button"
            label={strings.settings_auth}
            onClick={() => void navigate({ to: ManagementAuthSettingsNavigation.AuthSettings.route })}
          />
          <CoreButton
            type="button"
            label={strings.settings_global}
            onClick={() => void navigate({ to: ManagementSettingsNavigation.GlobalSettings.route })}
          />
          <CoreButton
            type="button"
            label={strings.settings_security}
            onClick={() => void navigate({ to: ManagementSecurityNavigation.SecuritySettings.route })}
          />
        </div>
      </div>
    )
  }
})
