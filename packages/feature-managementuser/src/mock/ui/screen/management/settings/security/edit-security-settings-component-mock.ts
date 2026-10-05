import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { EditSecuritySettingsStoreDependencies } from '@/ui/screens/management/settings/security/EditSecuritySettingsStore'

export const editSecuritySettingsDependenciesMock = (
  overrides?: Partial<EditSecuritySettingsStoreDependencies>
): EditSecuritySettingsStoreDependencies => ({
  getManagementSecuritySettingsUseCase: {
    execute: async () =>
      appResultSuccess({
        recentAuthenticationValiditySecondsForOpenUser: 300,
        recentAuthenticationValiditySecondsForManagementUser: 300,
        mfaTokenExpirationSeconds: 300,
        passwordPolicy: {
          minLength: 8,
          requireLetter: true,
          requireUpperCase: false,
          requireLowerCase: false,
          requireDigit: true,
          requireSpecialChar: false,
          commonPasswords: new Set()
        },
        otpConfirmation: {
          retryAfterSeconds: 60,
          numberOfSymbols: 6,
          expirationSeconds: 300
        },
        accountLockoutPolicy: {
          maxFailedPasswordAttempts: 5,
          maxFailedOtpAttempts: 5,
          maxFailedTotpAttempts: 5,
          failedAttemptsWindowSeconds: 300,
          lockoutDurationSeconds: 300,
          indefiniteLockoutThreshold: 3,
          isSelfServiceUnlockEnabled: true
        },
        accountLockoutCheckIntervalSeconds: 60,
        openIpRestrictionPolicy: {
          isBlacklistEnabled: false,
          blacklist: [],
          isWhitelistEnabled: false,
          whitelist: []
        },
        managementIpRestrictionPolicy: {
          isBlacklistEnabled: false,
          blacklist: [],
          isWhitelistEnabled: false,
          whitelist: []
        },
        maxRequestsPerPeriod: 100,
        rateLimitPeriodSeconds: 60,
        refreshTokenRotationGracePeriodSeconds: 30
      })
  } as any,
  saveRemoteSecuritySettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  resetRemoteSecuritySettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onBack: () => {},
  ...overrides
})
