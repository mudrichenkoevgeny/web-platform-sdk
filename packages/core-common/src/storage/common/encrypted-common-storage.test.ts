import { describe, it, expect, vi } from 'vitest'
import { EncryptedCommonStorage } from '@/storage/common/encrypted-common-storage'
import { createInMemoryEncryptedSettings, EncryptedSettingsMock } from '@/mock/storage/encrypted-settings-mock'

describe('EncryptedCommonStorage', () => {
  it('returns null when deviceId is not set in storage', async () => {
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)

    const deviceId = await storage.getDeviceId()
    expect(deviceId).toBeNull()
  })

  it('updates and gets deviceId correctly', async () => {
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)

    await storage.updateDeviceId('device-123')
    const deviceId = await storage.getDeviceId()

    expect(deviceId).toBe('device-123')
  })

  it('clears stored deviceId', async () => {
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)

    await storage.updateDeviceId('device-123')
    await storage.clear()

    const deviceId = await storage.getDeviceId()
    expect(deviceId).toBeNull()
  })

  it('handles encryptedSettings errors when reading or writing deviceId', async () => {
    const settings = new EncryptedSettingsMock()
    vi.spyOn(settings, 'get').mockRejectedValue(new Error('Storage access error'))
    const storage = new EncryptedCommonStorage(settings)

    await expect(storage.getDeviceId()).rejects.toThrow('Storage access error')
  })
})
