import { describe, it, expect, beforeEach } from 'vitest'
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
})
