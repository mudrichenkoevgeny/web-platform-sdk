import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { EditAuthSettingsStoreDependencies } from '@/ui/screens/management/settings/auth/EditAuthSettingsStore'

export const editAuthSettingsDependenciesMock = (
  overrides?: Partial<EditAuthSettingsStoreDependencies>
): EditAuthSettingsStoreDependencies => ({
  getManagementAuthSettingsUseCase: {
    execute: async () =>
      appResultSuccess({
        availableAuthProviders: {
          primary: ['EMAIL'],
          secondary: ['GOOGLE']
        },
        maxTotalIdentifiers: 10,
        maxEmailIdentifiers: 5,
        maxPhoneIdentifiers: 5,
        maxIdentifiersPerExternalProvider: 2,
        maxActiveSessionsForOpenUser: 3,
        maxActiveSessionsForManagementUser: 5,
        accessTokenExpirationSeconds: 3600,
        refreshTokenExpirationSeconds: 86400,
        accountDeletionGracePeriodSeconds: 604800,
        accountDeletionCheckIntervalSeconds: 86400,
        isRegistrationEnabled: true,
        openEmailRestrictionPolicy: {
          isBlacklistEnabled: false,
          blacklist: [],
          isWhitelistEnabled: false,
          whitelist: []
        },
        managementEmailRestrictionPolicy: {
          isBlacklistEnabled: false,
          blacklist: [],
          isWhitelistEnabled: false,
          whitelist: []
        }
      })
  } as any,
  saveRemoteAuthSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  resetRemoteAuthSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onBack: () => {},
  ...overrides
})
