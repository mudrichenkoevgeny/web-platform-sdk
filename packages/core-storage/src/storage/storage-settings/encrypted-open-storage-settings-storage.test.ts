import { describe, it, expect } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedOpenStorageSettingsStorage } from './encrypted-open-storage-settings-storage'

describe('EncryptedOpenStorageSettingsStorage', () => {
  const sampleSettings: OpenStorageSettings = {
    userQuotaBytes: 104857600,
    presignedUrlTtlSeconds: 900,
    maxPendingUploads: 5,
    allowedMimeTypes: ['image/jpeg', 'image/png']
  }

  it('returns null when settings are not present in storage', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenStorageSettingsStorage(encryptedSettings)

    const result = await storage.getOpenStorageSettings()
    expect(result).toBeNull()
  })

  it('updates and retrieves settings correctly', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenStorageSettingsStorage(encryptedSettings)

    await storage.updateOpenStorageSettings(sampleSettings)
    const result = await storage.getOpenStorageSettings()

    expect(result).toEqual(sampleSettings)
  })

  it('clears persisted settings', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedOpenStorageSettingsStorage(encryptedSettings)

    await storage.updateOpenStorageSettings(sampleSettings)
    await storage.clearOpenStorageSettings()

    const result = await storage.getOpenStorageSettings()
    expect(result).toBeNull()
  })

  it('handles invalid stored JSON gracefully and cleans up entry', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    await encryptedSettings.put('storage_settings', 'invalid-json-{')
    const storage = new EncryptedOpenStorageSettingsStorage(encryptedSettings)

    const result = await storage.getOpenStorageSettings()
    expect(result).toBeNull()
    expect(await encryptedSettings.get('storage_settings')).toBeNull()
  })

  it('handles schema-mismatched JSON gracefully and cleans up entry', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    await encryptedSettings.put('storage_settings', JSON.stringify({ unknown_field: 123 }))
    const storage = new EncryptedOpenStorageSettingsStorage(encryptedSettings)

    const result = await storage.getOpenStorageSettings()
    expect(result).toBeNull()
    expect(await encryptedSettings.get('storage_settings')).toBeNull()
  })
})
