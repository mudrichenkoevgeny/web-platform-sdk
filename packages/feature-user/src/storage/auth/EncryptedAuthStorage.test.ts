import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  toUserIdentifierIdOrThrow,
  toUserSessionIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedAuthStorage } from '@/storage/auth/EncryptedAuthStorage'
import type { SessionToken } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedAuthStorage', () => {
  let mockEncryptedSettings: EncryptedSettingsMock
  let storage: EncryptedAuthStorage

  const dummySessionToken: SessionToken = {
    accessToken: { value: 'test-access-token' },
    refreshToken: { value: 'test-refresh-token' },
    expiresAt: Date.now() + 3600000,
    tokenType: 'Bearer',
    sessionId: toUserSessionIdOrThrow('session-123'),
    identifierId: toUserIdentifierIdOrThrow('identifier-456')
  }

  beforeEach(() => {
    mockEncryptedSettings = new EncryptedSettingsMock()
    storage = new EncryptedAuthStorage(mockEncryptedSettings)
  })

  it('initially has no token', () => {
    expect(storage.getAccessToken()).toBeNull()
  })

  it('persists tokens and notifies observers', async () => {
    const listener = vi.fn()
    storage.observeAccessToken(listener)

    expect(listener).toHaveBeenCalledWith(null)

    await storage.updateTokens(dummySessionToken)

    expect(storage.getAccessToken()).toBe('test-access-token')
    expect(await storage.getRefreshToken()).toEqual({ value: 'test-refresh-token' })
    expect(await storage.getSessionId()).toBe('session-123')
    expect(await storage.getIdentifierId()).toBe('identifier-456')
    expect(listener).toHaveBeenCalledWith('test-access-token')
  })

  it('clears tokens and notifies observers', async () => {
    const listener = vi.fn()
    await storage.updateTokens(dummySessionToken)

    storage.observeAccessToken(listener)
    await storage.clearTokens()

    expect(storage.getAccessToken()).toBeNull()
    expect(await storage.getAccessTokenModel()).toBeNull()
    expect(await storage.getRefreshToken()).toBeNull()
    expect(listener).toHaveBeenCalledWith(null)
  })

  it('auto-clears expired tokens on access', async () => {
    const expiredToken: SessionToken = {
      ...dummySessionToken,
      expiresAt: Date.now() - 1000
    }

    await storage.updateTokens(expiredToken)

    const model = await storage.getAccessTokenModel()
    expect(model).toBeNull()
    expect(storage.getAccessToken()).toBeNull()
  })
})
