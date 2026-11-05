import { describe, it, expect, vi } from 'vitest'
import { EncryptedSettingsMock } from '@/mock/storage/encrypted-settings-mock'

describe('EncryptedSettingsMock', () => {
  it('EncryptedSettingsMock puts, gets, removes and observes key changes', async () => {
    const settings = new EncryptedSettingsMock()
    const listener = vi.fn()
    const unsubscribe = settings.observe('testKey', listener)

    await settings.put('testKey', 'testVal')
    expect(await settings.get('testKey')).toBe('testVal')
    expect(listener).toHaveBeenCalledWith('testVal')

    await settings.remove('testKey')
    expect(await settings.get('testKey')).toBeNull()
    expect(listener).toHaveBeenCalledWith(null)

    unsubscribe()
  })
})
