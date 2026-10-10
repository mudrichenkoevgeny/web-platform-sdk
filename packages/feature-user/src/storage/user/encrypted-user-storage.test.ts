import { describe, it, expect, beforeEach } from 'vitest'
import {
  SortOrder,
  toUserIdOrThrow,
  toUserSessionIdOrThrow,
  UserSessionSortBy
} from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedUserStorage } from '@/storage/user/encrypted-user-storage'
import { userPrivateMock } from '@/mock/domain/model/user/user-details-mock'
import { userSessionSummaryMock } from '@/mock/domain/model/session/user-session-mock'

describe('EncryptedUserStorage', () => {
  let mockEncryptedSettings: EncryptedSettingsMock
  let storage: EncryptedUserStorage

  const dummyUser = userPrivateMock({ id: toUserIdOrThrow('usr_123') })

  const dummySession1 = userSessionSummaryMock({
    id: toUserSessionIdOrThrow('sess_1'),
    lastAccessedAt: 100,
    expiresAt: 1000
  })

  const dummySession2 = userSessionSummaryMock({
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

  it('saves and retrieves current user profile', async () => {
    await storage.updateCurrentUser(dummyUser)

    const retrieved = await storage.getCurrentUser()
    expect(retrieved).toEqual(dummyUser)
  })

  it('clears stored user data', async () => {
    await storage.updateCurrentUser(dummyUser)
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
    await storage.addUserSession(dummySession1)
    await storage.addUserSession(dummySession2)

    const sortedByAccessed = await storage.getUserSessionsList({
      pageNumber: 1,
      pageSize: 10,
      sortBy: UserSessionSortBy.LAST_ACCESSED_AT
    })
    expect(sortedByAccessed.items[0]?.id).toBe('sess_1')

    const sortedByExpiresDesc = await storage.getUserSessionsList({
      pageNumber: 1,
      pageSize: 10,
      sortBy: UserSessionSortBy.EXPIRES_AT,
      sortOrder: SortOrder.DESC
    })
    expect(sortedByExpiresDesc.items[0]?.id).toBe('sess_2')
  })
})
