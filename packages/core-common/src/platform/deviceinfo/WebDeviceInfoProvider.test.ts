import { describe, it, expect } from 'vitest'
import { WebDeviceInfoProvider } from './DeviceInfoProvider'
import { EncryptedCommonStorage } from '../../storage/common/EncryptedCommonStorage'
import { createInMemoryEncryptedSettings } from '../../mock/EncryptedSettingsMock'

describe('WebDeviceInfoProvider', () => {
  it('returns ClientDeviceInfoPayload with storage device_id and parsed userAgent', async () => {
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)
    await storage.updateDeviceId('device-999')

    const provider = new WebDeviceInfoProvider(storage, '2.1.0')
    const info = await provider.getDeviceInfo()

    expect(info.client_type).toBe('WEB')
    expect(info.device_id).toBe('device-999')
    expect(info.app_version).toBe('2.1.0')
    expect(info.device_name).toBeDefined()
    expect(info.operation_system_version).toBeDefined()
  })

  it('handles null device_id when storage is empty', async () => {
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)

    const provider = new WebDeviceInfoProvider(storage)
    const info = await provider.getDeviceInfo()

    expect(info.client_type).toBe('WEB')
    expect(info.device_id).toBeNull()
    expect(info.app_version).toBe('1.0.0')
  })
})
