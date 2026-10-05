import { describe, it, expect, beforeEach } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedOpenAuthSettingsStorage } from '@/storage/auth/settings/encrypted-open-auth-settings-storage'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedOpenAuthSettingsStorage', () => {
  let mockEncryptedSettings: EncryptedSettingsMock
  let storage: EncryptedOpenAuthSettingsStorage

  const dummySettings: OpenAuthSettings = {
    availableAuthProviders: {
      primary: [UserAuthProvider.EMAIL, UserAuthProvider.PHONE],
      secondary: [UserAuthProvider.GOOGLE, UserAuthProvider.APPLE]
    },
    maxTotalIdentifiers: 5,
    maxEmailIdentifiers: 2,
    maxPhoneIdentifiers: 2,
    maxIdentifiersPerExternalProvider: 1,
    isRegistrationEnabled: true
  }

  beforeEach(() => {
    mockEncryptedSettings = new EncryptedSettingsMock()
    storage = new EncryptedOpenAuthSettingsStorage(mockEncryptedSettings)
  })

  it('returns null when storage is empty', async () => {
    const settings = await storage.getOpenAuthSettings()
    expect(settings).toBeNull()
  })

  it('saves and retrieves open auth settings', async () => {
    await storage.updateOpenAuthSettings(dummySettings)

    const retrieved = await storage.getOpenAuthSettings()
    expect(retrieved).toEqual(dummySettings)
  })

  it('clears stored open auth settings', async () => {
    await storage.updateOpenAuthSettings(dummySettings)
    await storage.clearOpenAuthSettings()

    const retrieved = await storage.getOpenAuthSettings()
    expect(retrieved).toBeNull()
  })

  it('removes corrupted JSON entries', async () => {
    await mockEncryptedSettings.put('auth_open_settings', '{ corrupted_json: true')

    const retrieved = await storage.getOpenAuthSettings()
    expect(retrieved).toBeNull()
    expect(await mockEncryptedSettings.get('auth_open_settings')).toBeNull()
  })
})
