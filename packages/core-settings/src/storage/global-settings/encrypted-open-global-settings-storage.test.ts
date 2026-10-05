import { describe, it, expect } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedOpenGlobalSettingsStorage } from '@/storage/global-settings/encrypted-open-global-settings-storage'
import type { OpenGlobalSettings } from '@/domain/model/open-global-settings'

describe('EncryptedOpenGlobalSettingsStorage', () => {
  const sampleSettings: OpenGlobalSettings = {
    privacyPolicyUrl: 'https://example.com/privacy',
    termsOfServiceUrl: 'https://example.com/terms',
    contactSupportEmail: 'support@example.com',
    minSupportedAppVersions: {
      android: '1.0.0',
      ios: '1.0.0'
    }
  }

  it('returns null when settings are not present in storage', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenGlobalSettingsStorage(encryptedSettings)

    const result = await storage.getOpenGlobalSettings()
    expect(result).toBeNull()
  })

  it('updates and retrieves settings correctly', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenGlobalSettingsStorage(encryptedSettings)

    await storage.updateOpenGlobalSettings(sampleSettings)
    const result = await storage.getOpenGlobalSettings()

    expect(result).toEqual(sampleSettings)
  })

  it('clears persisted settings', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenGlobalSettingsStorage(encryptedSettings)

    await storage.updateOpenGlobalSettings(sampleSettings)
    await storage.clearOpenGlobalSettings()

    const result = await storage.getOpenGlobalSettings()
    expect(result).toBeNull()
  })

  it('handles invalid stored JSON gracefully and cleans up entry', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    await encryptedSettings.put('global_settings', 'invalid-json-{')
    const storage = new EncryptedOpenGlobalSettingsStorage(encryptedSettings)

    const result = await storage.getOpenGlobalSettings()
    expect(result).toBeNull()
    expect(await encryptedSettings.get('global_settings')).toBeNull()
  })

  it('handles schema-mismatched JSON gracefully and cleans up entry', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    await encryptedSettings.put('global_settings', JSON.stringify({ unknown_field: 123 }))
    const storage = new EncryptedOpenGlobalSettingsStorage(encryptedSettings)

    const result = await storage.getOpenGlobalSettings()
    expect(result).toBeNull()
    expect(await encryptedSettings.get('global_settings')).toBeNull()
  })
})
