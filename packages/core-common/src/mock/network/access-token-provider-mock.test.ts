import { describe, it, expect, vi } from 'vitest'
import { AccessTokenProviderMock } from '@/mock/network/access-token-provider-mock'

describe('AccessTokenProviderMock', () => {
  it('AccessTokenProviderMock manages token and notifies listeners', () => {
    const provider = new AccessTokenProviderMock('initial')
    const listener = vi.fn()
    const unsubscribe = provider.observeAccessToken(listener)

    expect(provider.getAccessToken()).toBe('initial')
    provider.setAccessToken('new-token')

    expect(listener).toHaveBeenCalledWith('new-token')
    expect(provider.getAccessToken()).toBe('new-token')

    unsubscribe()
    provider.setAccessToken('another-token')
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
