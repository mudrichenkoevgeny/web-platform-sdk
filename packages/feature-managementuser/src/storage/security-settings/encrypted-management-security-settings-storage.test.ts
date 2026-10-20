import { describe, it, expect, beforeEach } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedManagementSecuritySettingsStorage } from '@/storage/security-settings/encrypted-management-security-settings-storage'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedManagementSecuritySettingsStorage', () => {
  let mockSettingsStorage: EncryptedSettingsMock
  let storage: EncryptedManagementSecuritySettingsStorage

  const mockSettings: ManagementSecuritySettings = {
    recentAuthenticationValiditySecondsForOpenUser: 300,
    recentAuthenticationValiditySecondsForManagementUser: 300,
    passwordPolicy: {
      minLength: 8,
      requireLetter: true,
      requireUpperCase: true,
      requireLowerCase: true,
      requireDigit: true,
      requireSpecialChar: true,
      commonPasswords: []
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
      failedAttemptsWindowSeconds: 600,
      lockoutDurationSeconds: 1800,
      indefiniteLockoutThreshold: 10,
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
    mfaTokenExpirationSeconds: 300,
    maxRequestsPerPeriod: 100,
    rateLimitPeriodSeconds: 60,
    refreshTokenRotationGracePeriodSeconds: 10
  }

  beforeEach(() => {
    mockSettingsStorage = new EncryptedSettingsMock()
    storage = new EncryptedManagementSecuritySettingsStorage(mockSettingsStorage)
  })

  it('returns null when storage is empty', async () => {
    expect(await storage.getManagementSecuritySettings()).toBeNull()
  })

  it('saves and retrieves management security settings', async () => {
    await storage.updateManagementSecuritySettings(mockSettings)
    expect(await storage.getManagementSecuritySettings()).toEqual(mockSettings)
  })

  it('clears stored settings', async () => {
    await storage.updateManagementSecuritySettings(mockSettings)
    await storage.clearManagementSecuritySettings()
    expect(await storage.getManagementSecuritySettings()).toBeNull()
  })
})
