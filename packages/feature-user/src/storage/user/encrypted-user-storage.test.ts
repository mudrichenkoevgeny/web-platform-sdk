import { describe, it, expect, beforeEach } from 'vitest'
import { createTestUserPrivate, createTestUserSessionSummaryPayload, createTestPagedResult, SortOrder, TEST_SESSION_ID, TEST_USER_ID, toUserIdOrThrow, UserSessionSortBy, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
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
    const mockPayload1 = createTestUserSessionSummaryPayload({
      id: toUserSessionIdOrThrow(TEST_SESSION_ID),
      last_accessed_at: 100,
      expires_at: 1000
    })
    const mockPayload2 = createTestUserSessionSummaryPayload({
      id: toUserSessionIdOrThrow('sess_456'),
      last_accessed_at: 200,
      expires_at: 2000
    })

    await storage.updateUserSessionsPayloadList(createTestPagedResult({
      items: [mockPayload1, mockPayload2],
      totalCount: 2,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    }))

    const sortedByAccessed = await storage.getUserSessionsList({
      pageNumber: 1,
      pageSize: 10,
      sortBy: UserSessionSortBy.LAST_ACCESSED_AT
    })
    expect(sortedByAccessed.items[0]?.id).toBe(toUserSessionIdOrThrow(TEST_SESSION_ID))

    const sortedByExpiresDesc = await storage.getUserSessionsList({
      pageNumber: 1,
      pageSize: 10,
      sortBy: UserSessionSortBy.EXPIRES_AT,
      sortOrder: SortOrder.DESC
    })
    expect(sortedByExpiresDesc.items[0]?.id).toBe(toUserSessionIdOrThrow('sess_456'))
  })
})
