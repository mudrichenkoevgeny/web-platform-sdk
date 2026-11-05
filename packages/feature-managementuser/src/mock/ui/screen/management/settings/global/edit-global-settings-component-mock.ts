import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { EditGlobalSettingsStoreDependencies } from '@/ui/screens/management/settings/global/edit-global-settings-store'
import type { GetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/get-management-global-settings-use-case'
import type { UpdateManagementGlobalSettingsUseCase } from '@/usecase/global-settings/update-management-global-settings-use-case'
import type { ResetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/reset-management-global-settings-use-case'

export const editGlobalSettingsDependenciesMock = (
  overrides?: Partial<EditGlobalSettingsStoreDependencies>
): EditGlobalSettingsStoreDependencies => ({
  getManagementGlobalSettingsUseCase: {
    execute: async () =>
      appResultSuccess({
        privacyPolicyUrl: 'https://example.com/privacy',
        termsOfServiceUrl: 'https://example.com/terms',
        contactSupportEmail: 'support@example.com',
        minSupportedAppVersions: {
          ANDROID: '1.0.0'
        },
        isTracingEnabled: true,
        isMetricsEnabled: true,
        isVerboseLoggingEnabled: false
      })
  } as unknown as GetManagementGlobalSettingsUseCase,
  updateManagementGlobalSettingsUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as UpdateManagementGlobalSettingsUseCase,
  resetManagementGlobalSettingsUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as ResetManagementGlobalSettingsUseCase,
  onBack: () => {},
  ...overrides
})
