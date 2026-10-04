import { describe, it, expect, vi } from 'vitest'
import { WebCryptoSettings, getSettingsFactory } from '@/storage/WebCryptoSettings'

class MockLocalStorage implements Storage {
  private store = new Map<string, string>()

  public get length(): number {
    return this.store.size
  }

  public clear(): void {
    this.store.clear()
  }

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  public key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  public removeItem(key: string): void {
    this.store.delete(key)
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value)
  }
}

describe('WebCryptoSettings', () => {
  it('encrypts, stores and decrypts values correctly', async () => {
    const mockStorage = new MockLocalStorage()
    const settings = new WebCryptoSettings(mockStorage)

    await settings.put('secret_key', 'my-secret-value')
    const storedRaw = mockStorage.getItem('secret_key')

    expect(storedRaw).not.toBe('my-secret-value')
    expect(storedRaw).toContain(':')

    const decrypted = await settings.get('secret_key')
    expect(decrypted).toBe('my-secret-value')
  })

  it('returns null for missing key', async () => {
    const mockStorage = new MockLocalStorage()
    const settings = new WebCryptoSettings(mockStorage)

    const result = await settings.get('non_existent')
    expect(result).toBeNull()
  })

  it('removes stored items', async () => {
    const mockStorage = new MockLocalStorage()
    const settings = new WebCryptoSettings(mockStorage)

    await settings.put('key1', 'val1')
    await settings.remove('key1')

    const result = await settings.get('key1')
    expect(result).toBeNull()
  })

  it('notifies listeners on observe', async () => {
    const mockStorage = new MockLocalStorage()
    const settings = new WebCryptoSettings(mockStorage)

    const listener = vi.fn()
    const unsubscribe = settings.observe('key1', listener)

    await settings.put('key1', 'val1')
    expect(listener).toHaveBeenCalledWith('val1')

    await settings.remove('key1')
    expect(listener).toHaveBeenCalledWith(null)

    unsubscribe()
    await settings.put('key1', 'val2')
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('notifies all listeners when storage is cleared externally (event.key === null)', async () => {
    const mockStorage = new MockLocalStorage()
    const settings = new WebCryptoSettings(mockStorage)

    const listener = vi.fn()
    settings.observe('key1', listener)

    const storageEvent = new StorageEvent('storage', { key: null })
    window.dispatchEvent(storageEvent)

    expect(listener).toHaveBeenCalledWith(null)
  })

  it('getSettingsFactory creates WebCryptoSettingsFactory instance', () => {
    const factory = getSettingsFactory()
    const instance = factory.create()
    expect(instance).toBeInstanceOf(WebCryptoSettings)
  })
})
