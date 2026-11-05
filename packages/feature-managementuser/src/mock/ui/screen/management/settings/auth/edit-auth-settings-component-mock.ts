import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { EditAuthSettingsStoreDependencies } from '@/ui/screens/management/settings/auth/edit-auth-settings-store'
import type { GetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/get-management-auth-settings-use-case'
import type { UpdateManagementAuthSettingsUseCase } from '@/usecase/auth/settings/update-management-auth-settings-use-case'
import type { ResetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/reset-management-auth-settings-use-case'

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
  } as unknown as GetManagementAuthSettingsUseCase,
  updateManagementAuthSettingsUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as UpdateManagementAuthSettingsUseCase,
  resetManagementAuthSettingsUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as ResetManagementAuthSettingsUseCase,
  onBack: () => {},
  ...overrides
})
