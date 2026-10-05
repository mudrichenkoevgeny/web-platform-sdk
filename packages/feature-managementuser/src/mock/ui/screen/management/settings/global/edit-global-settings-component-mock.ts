import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { EditGlobalSettingsStoreDependencies } from '@/ui/screens/management/settings/global/EditGlobalSettingsStore'

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
  } as any,
  saveRemoteGlobalSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  resetRemoteGlobalSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onBack: () => {},
  ...overrides
})
