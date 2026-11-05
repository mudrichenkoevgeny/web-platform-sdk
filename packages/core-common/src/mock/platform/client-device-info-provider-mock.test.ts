import { describe, it, expect } from 'vitest'
import { ClientDeviceInfoProviderMock } from '@/mock/platform/client-device-info-provider-mock'

describe('ClientDeviceInfoProviderMock', () => {
  it('ClientDeviceInfoProviderMock returns configured mock device payload', async () => {
    const provider = new ClientDeviceInfoProviderMock({ app_version: '3.0.0' })
    const info = await provider.getClientDeviceInfo()

    expect(info.client_type).toBe('web')
    expect(info.app_version).toBe('3.0.0')
  })
})
