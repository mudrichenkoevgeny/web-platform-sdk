import { describe, it, expect } from 'vitest'
import { EncryptedCommonStorage } from './EncryptedCommonStorage'
import { createInMemoryEncryptedSettings } from '../../mock/storage/EncryptedSettingsMock'

describe('EncryptedCommonStorage', () => {
  it('returns null when deviceId is not set', async () => {
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
})
