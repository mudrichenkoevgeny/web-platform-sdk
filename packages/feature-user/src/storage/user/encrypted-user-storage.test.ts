import { describe, it, expect, beforeEach } from 'vitest'
import { createTestUserPrivate, createTestUserSessionSummary, SortOrder, TEST_USER_ID, toUserIdOrThrow, toUserSessionIdOrThrow, UserSessionSortBy } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedUserStorage } from '@/storage/user/encrypted-user-storage'

describe('EncryptedUserStorage', () => {
  let mockEncryptedSettings: EncryptedSettingsMock
  let storage: EncryptedUserStorage

  const mockUser = createTestUserPrivate({ id: toUserIdOrThrow(TEST_USER_ID) })

  const mockSession1 = createTestUserSessionSummary({
    id: toUserSessionIdOrThrow('sess_1'),
    lastAccessedAt: 100,
    expiresAt: 1000
  })

  const mockSession2 = createTestUserSessionSummary({
    id: toUserSessionIdOrThrow('sess_2'),
    lastAccessedAt: 200,
    expiresAt: 2000
  })

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

  it('handles empty identifier and session lists', async () => {
    const identifiers = await storage.getUserIdentifiersList()
    expect(identifiers.items).toHaveLength(0)

    const sessions = await storage.getUserSessionsList()
    expect(sessions.items).toHaveLength(0)
  })

  it('removes corrupted list data from storage when Zod validation fails', async () => {
    await mockEncryptedSettings.put('user_identifiers_list', JSON.stringify({ invalid: true }))
    await mockEncryptedSettings.put('user_sessions_list', JSON.stringify({ invalid: true }))

    const identifiers = await storage.getUserIdentifiersList()
    expect(identifiers.items).toHaveLength(0)
    expect(await mockEncryptedSettings.get('user_identifiers_list')).toBeNull()

    const sessions = await storage.getUserSessionsList()
    expect(sessions.items).toHaveLength(0)
    expect(await mockEncryptedSettings.get('user_sessions_list')).toBeNull()
  })

  it('sorts sessions by LAST_ACCESSED_AT and EXPIRES_AT', async () => {
    await storage.addUserSession(mockSession1)
    await storage.addUserSession(mockSession2)

    const sortedByAccessed = await storage.getUserSessionsList({
      pageNumber: 1,
      pageSize: 10,
      sortBy: UserSessionSortBy.LAST_ACCESSED_AT
    })
    expect(sortedByAccessed.items[0]?.id).toBe(mockSession1.id)

    const sortedByExpiresDesc = await storage.getUserSessionsList({
      pageNumber: 1,
      pageSize: 10,
      sortBy: UserSessionSortBy.EXPIRES_AT,
      sortOrder: SortOrder.DESC
    })
    expect(sortedByExpiresDesc.items[0]?.id).toBe(mockSession2.id)
  })
})
