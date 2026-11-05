import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  toAccessTokenOrThrow,
  toRefreshTokenOrThrow,
  toUserIdentifierIdOrThrow,
  toUserSessionIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedAuthStorage } from '@/storage/auth/encrypted-auth-storage'
import type { SessionToken } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedAuthStorage', () => {
  let mockEncryptedSettings: EncryptedSettingsMock
  let storage: EncryptedAuthStorage

  const mockSessionToken: SessionToken = {
    accessToken: toAccessTokenOrThrow('test-access-token'),
    refreshToken: toRefreshTokenOrThrow('test-refresh-token'),
    expiresAt: Date.now() + 3600000,
    tokenType: 'Bearer',
    sessionId: toUserSessionIdOrThrow('session-123'),
    identifierId: toUserIdentifierIdOrThrow('identifier-456')
  }

  beforeEach(() => {
    mockEncryptedSettings = new EncryptedSettingsMock()
    storage = new EncryptedAuthStorage(mockEncryptedSettings)
  })

  it('initially has no token and hasSession returns false', async () => {
    expect(storage.getAccessToken()).toBeNull()
    expect(await storage.hasSession()).toBe(false)
  })

  it('initializes token cache in init() if token is unexpired', async () => {
    await storage.updateTokens(mockSessionToken)

    const newStorage = new EncryptedAuthStorage(mockEncryptedSettings)
    await newStorage.init()

    expect(newStorage.getAccessToken()).toBe('test-access-token')
  })

  it('clears expired tokens in init() if token is expired', async () => {
    const expiredToken: SessionToken = {
      ...mockSessionToken,
      expiresAt: Date.now() - 1000
    }
    await storage.updateTokens(expiredToken)

    const newStorage = new EncryptedAuthStorage(mockEncryptedSettings)
    await newStorage.init()

    expect(newStorage.getAccessToken()).toBeNull()
    expect(await newStorage.getRefreshToken()).toBeNull()
  })

  it('persists tokens, returns domain models, and notifies observers', async () => {
    const listener = vi.fn()
    storage.observeAccessToken(listener)

    expect(listener).toHaveBeenCalledWith(null)

    await storage.updateTokens(mockSessionToken)

    expect(storage.getAccessToken()).toBe('test-access-token')
    expect(await storage.getRefreshToken()).toBe('test-refresh-token')
    expect(await storage.getSessionId()).toBe('session-123')
    expect(await storage.getIdentifierId()).toBe('identifier-456')
    expect(await storage.getExpiresAt()).toBe(mockSessionToken.expiresAt)
    expect(await storage.hasSession()).toBe(true)
    expect(listener).toHaveBeenCalledWith('test-access-token')
  })

  it('clears tokens and notifies observers', async () => {
    const listener = vi.fn()
    await storage.updateTokens(mockSessionToken)

    storage.observeAccessToken(listener)
    await storage.clearTokens()

    expect(storage.getAccessToken()).toBeNull()
    expect(await storage.getAccessTokenModel()).toBeNull()
    expect(await storage.getRefreshToken()).toBeNull()
    expect(await storage.getSessionId()).toBeNull()
    expect(await storage.getIdentifierId()).toBeNull()
    expect(await storage.hasSession()).toBe(false)
    expect(listener).toHaveBeenCalledWith(null)
  })

  it('does not trigger listener after unsubscribing', async () => {
    const listener = vi.fn()
    const unsubscribe = storage.observeAccessToken(listener)
    listener.mockClear()

    unsubscribe()
    await storage.updateTokens(mockSessionToken)

    expect(listener).not.toHaveBeenCalled()
  })

  it('auto-clears expired tokens when getAccessTokenModel is called', async () => {
    const expiredToken: SessionToken = {
      ...mockSessionToken,
      expiresAt: Date.now() - 1000
    }

    await storage.updateTokens(expiredToken)

    const model = await storage.getAccessTokenModel()
    expect(model).toBeNull()
    expect(storage.getAccessToken()).toBeNull()
  })
})
