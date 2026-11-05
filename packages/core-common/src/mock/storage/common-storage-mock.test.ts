import { describe, it, expect } from 'vitest'
import { CommonStorageMock } from '@/mock/storage/common-storage-mock'

describe('CommonStorageMock', () => {
  it('CommonStorageMock stores and clears deviceId', async () => {
    const storage = new CommonStorageMock()
    expect(await storage.getDeviceId()).toBeNull()

    await storage.updateDeviceId('dev-1')
    expect(await storage.getDeviceId()).toBe('dev-1')

    await storage.clear()
    expect(await storage.getDeviceId()).toBeNull()
  })
})
