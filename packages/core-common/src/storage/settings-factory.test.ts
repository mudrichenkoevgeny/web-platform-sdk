import { describe, it, expect } from 'vitest'
import { getSettingsFactory, WebCryptoSettingsFactory } from '@/storage/web-crypto-settings'

describe('SettingsFactory', () => {
  it('creates an EncryptedSettings instance', () => {
    const mockStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    }
    const factory = getSettingsFactory(mockStorage)
    expect(factory).toBeInstanceOf(WebCryptoSettingsFactory)

    const settings = factory.create()
    expect(settings).toBeDefined()
  })
})
