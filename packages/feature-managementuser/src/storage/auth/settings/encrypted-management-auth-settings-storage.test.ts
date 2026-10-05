import { describe, it, expect, beforeEach } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedManagementAuthSettingsStorage } from '@/storage/auth/settings/EncryptedManagementAuthSettingsStorage'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedManagementAuthSettingsStorage', () => {
  let mockSettings: EncryptedSettingsMock
  let storage: EncryptedManagementAuthSettingsStorage

  const dummySettings: ManagementAuthSettings = {
    availableAuthProviders: { primary: [], secondary: [] },
    maxTotalIdentifiers: 10,
    maxEmailIdentifiers: 5,
    maxPhoneIdentifiers: 5,
    maxIdentifiersPerExternalProvider: 3,
    maxActiveSessionsForOpenUser: 5,
    maxActiveSessionsForManagementUser: 5,
    accessTokenExpirationSeconds: 3600,
    refreshTokenExpirationSeconds: 86400,
    accountDeletionGracePeriodSeconds: 2592000,
    accountDeletionCheckIntervalSeconds: 3600,
    isRegistrationEnabled: true,
    openEmailRestrictionPolicy: { isBlacklistEnabled: false, blacklist: [], isWhitelistEnabled: false, whitelist: [] },
    managementEmailRestrictionPolicy: { isBlacklistEnabled: false, blacklist: [], isWhitelistEnabled: false, whitelist: [] }
  }

  beforeEach(() => {
    mockSettings = new EncryptedSettingsMock()
    storage = new EncryptedManagementAuthSettingsStorage(mockSettings)
  })

  it('returns null when storage is empty', async () => {
    expect(await storage.getManagementAuthSettings()).toBeNull()
  })

  it('saves and retrieves management auth settings', async () => {
    await storage.updateManagementAuthSettings(dummySettings)
    expect(await storage.getManagementAuthSettings()).toEqual(dummySettings)
  })

  it('clears stored settings', async () => {
    await storage.updateManagementAuthSettings(dummySettings)
    await storage.clearManagementAuthSettings()
    expect(await storage.getManagementAuthSettings()).toBeNull()
  })
})
