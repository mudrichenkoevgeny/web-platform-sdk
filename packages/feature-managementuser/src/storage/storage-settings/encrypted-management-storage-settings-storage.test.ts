import { describe, it, expect } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedManagementStorageSettingsStorage } from './encrypted-management-storage-settings-storage'

describe('EncryptedManagementStorageSettingsStorage', () => {
  const sampleSettings = createTestManagementStorageSettings()

  it('returns null when settings are not present in storage', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedManagementStorageSettingsStorage(encryptedSettings)

    const result = await storage.getManagementStorageSettings()
    expect(result).toBeNull()
  })

  it('updates and retrieves settings correctly', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedManagementStorageSettingsStorage(encryptedSettings)

    await storage.updateManagementStorageSettings(sampleSettings)
    const result = await storage.getManagementStorageSettings()

    expect(result).toEqual(sampleSettings)
  })

  it('clears persisted settings', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    const storage = new EncryptedManagementStorageSettingsStorage(encryptedSettings)

    await storage.updateManagementStorageSettings(sampleSettings)
    await storage.clearManagementStorageSettings()

    const result = await storage.getManagementStorageSettings()
    expect(result).toBeNull()
  })

  it('handles invalid stored JSON gracefully and cleans up entry', async () => {
    const encryptedSettings = new EncryptedSettingsMock()
    await encryptedSettings.put('storage_management_settings', 'invalid-json-{')
    const storage = new EncryptedManagementStorageSettingsStorage(encryptedSettings)

    const result = await storage.getManagementStorageSettings()
    expect(result).toBeNull()
    expect(await encryptedSettings.get('storage_management_settings')).toBeNull()
  })
})
