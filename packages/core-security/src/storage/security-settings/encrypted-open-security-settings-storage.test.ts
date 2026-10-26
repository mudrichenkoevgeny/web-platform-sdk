import { describe, it, expect } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenSecuritySettingsPayload, toOpenSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedOpenSecuritySettingsStorage } from '@/storage/security-settings/encrypted-open-security-settings-storage'

describe('EncryptedOpenSecuritySettingsStorage', () => {
  const sampleSettings = toOpenSecuritySettings(createTestOpenSecuritySettingsPayload())

  it('returns null when settings are not present in storage', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenSecuritySettingsStorage(encryptedSettings)

    const result = await storage.getOpenSecuritySettings()
    expect(result).toBeNull()
  })

  it('updates and retrieves settings correctly', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenSecuritySettingsStorage(encryptedSettings)

    await storage.updateOpenSecuritySettings(sampleSettings)
    const result = await storage.getOpenSecuritySettings()

    expect(result).toEqual(sampleSettings)
  })

  it('clears persisted settings', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenSecuritySettingsStorage(encryptedSettings)

    await storage.updateOpenSecuritySettings(sampleSettings)
    await storage.clearOpenSecuritySettings()

    const result = await storage.getOpenSecuritySettings()
    expect(result).toBeNull()
  })

  it('handles invalid stored JSON gracefully and cleans up entry', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    await encryptedSettings.put('security_settings', 'invalid-json-{')
    const storage = new EncryptedOpenSecuritySettingsStorage(encryptedSettings)

    const result = await storage.getOpenSecuritySettings()
    expect(result).toBeNull()
    expect(await encryptedSettings.get('security_settings')).toBeNull()
  })

  it('handles schema-mismatched JSON gracefully and cleans up entry', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    await encryptedSettings.put('security_settings', JSON.stringify({ unknown_field: 123 }))
    const storage = new EncryptedOpenSecuritySettingsStorage(encryptedSettings)

    const result = await storage.getOpenSecuritySettings()
    expect(result).toBeNull()
    expect(await encryptedSettings.get('security_settings')).toBeNull()
  })
})
