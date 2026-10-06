import { describe, it, expect } from 'vitest'
import { WebDeviceInfoProvider } from '@/platform/device-info/device-info-provider'
import { EncryptedCommonStorage } from '@/storage/common/encrypted-common-storage'
import { createInMemoryEncryptedSettings } from '@/mock/storage/encrypted-settings-mock'

describe('WebDeviceInfoProvider', () => {
  it('returns ClientDeviceInfoPayload with storage device_id and parsed userAgent', async () => {
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)
    await storage.updateDeviceId('device-999')

    const provider = new WebDeviceInfoProvider(storage, '2.1.0')
    const info = await provider.getDeviceInfo()

    expect(info.client_type).toBe('web')
    expect(info.device_id).toBe('device-999')
    expect(info.app_version).toBe('2.1.0')
    expect(info.device_name).toBeDefined()
    expect(info.operation_system_version).toBe('web')
  })

  it('generates and persists device_id when storage is empty', async () => {
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)

    const provider = new WebDeviceInfoProvider(storage)
    const info = await provider.getDeviceInfo()

    expect(info.client_type).toBe('web')
    expect(info.device_id).not.toBeNull()
    expect(info.app_version).toBe('"unspecified"')

    const storedId = await storage.getDeviceId()
    expect(storedId).toBe(info.device_id)
  })
})
