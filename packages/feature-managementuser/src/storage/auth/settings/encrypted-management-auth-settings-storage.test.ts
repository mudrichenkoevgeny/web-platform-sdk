import { describe, it, expect, beforeEach } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedManagementAuthSettingsStorage } from '@/storage/auth/settings/encrypted-management-auth-settings-storage'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedManagementAuthSettingsStorage', () => {
  let mockSettingsStorage: EncryptedSettingsMock
  let storage: EncryptedManagementAuthSettingsStorage

  const mockSettings: ManagementAuthSettings = {
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
    userNicknameMinLength: 3,
    userNicknameMaxLength: 30,
    userDisplayNameMinLength: 1,
    userDisplayNameMaxLength: 50,
    isUserNicknameChangeAllowed: true,
    openEmailRestrictionPolicy: { isBlacklistEnabled: false, blacklist: [], isWhitelistEnabled: false, whitelist: [] },
    managementEmailRestrictionPolicy: { isBlacklistEnabled: false, blacklist: [], isWhitelistEnabled: false, whitelist: [] }
  }

  beforeEach(() => {
    mockSettingsStorage = new EncryptedSettingsMock()
    storage = new EncryptedManagementAuthSettingsStorage(mockSettingsStorage)
  })

  it('returns null when storage is empty', async () => {
    expect(await storage.getManagementAuthSettings()).toBeNull()
  })

  it('saves and retrieves management auth settings', async () => {
    await storage.updateManagementAuthSettings(mockSettings)
    expect(await storage.getManagementAuthSettings()).toEqual(mockSettings)
  })

  it('clears stored settings', async () => {
    await storage.updateManagementAuthSettings(mockSettings)
    await storage.clearManagementAuthSettings()
    expect(await storage.getManagementAuthSettings()).toBeNull()
  })

  it('returns null and cleans up entry when JSON is corrupted', async () => {
    await mockSettingsStorage.put('auth_management_settings', 'corrupted-{')
    expect(await storage.getManagementAuthSettings()).toBeNull()
    expect(await mockSettingsStorage.get('auth_management_settings')).toBeNull()
  })
})
