import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestUserPrivate, TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedUserStorage } from '@/storage/user/encrypted-user-storage'

describe('EncryptedUserStorage', () => {
  let mockEncryptedSettings: EncryptedSettingsMock
  let storage: EncryptedUserStorage

  const mockUser = createTestUserPrivate({ id: toUserIdOrThrow(TEST_USER_ID) })

  beforeEach(() => {
    mockEncryptedSettings = new EncryptedSettingsMock()
    storage = new EncryptedUserStorage(mockEncryptedSettings)
  })

  it('returns null when current user is empty', async () => {
    const user = await storage.getCurrentUser()
    expect(user).toBeNull()
  })

  it('saves and retrieves current user', async () => {
    await storage.updateCurrentUser(mockUser)

    const retrieved = await storage.getCurrentUser()
    expect(retrieved).toEqual(mockUser)
  })

  it('clears stored user data', async () => {
    await storage.updateCurrentUser(mockUser)
    await storage.clear()

    const retrieved = await storage.getCurrentUser()
    expect(retrieved).toBeNull()
  })

  it('returns null when stored user JSON is corrupted', async () => {
    await mockEncryptedSettings.put('current_user', 'invalid-json-{')

    const retrieved = await storage.getCurrentUser()
    expect(retrieved).toBeNull()
  })

  it('returns null when stored user JSON fails schema validation', async () => {
    await mockEncryptedSettings.put('current_user', JSON.stringify({ invalid_schema: true }))

    const retrieved = await storage.getCurrentUser()
    expect(retrieved).toBeNull()
  })

  it('observes current user changes via encryptedSettings listener', async () => {
    const listener = vi.fn()
    const unsubscribe = storage.observeCurrentUser(listener)

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(listener).toHaveBeenCalledWith(null)

    await storage.updateCurrentUser(mockUser)

    expect(listener).toHaveBeenCalledWith(mockUser)

    unsubscribe()
  })
})
