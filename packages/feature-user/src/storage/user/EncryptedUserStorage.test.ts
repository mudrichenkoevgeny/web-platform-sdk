import { describe, it, expect, beforeEach } from 'vitest'
import {
  AccountLockoutType,
  ClientType,
  toClientDeviceIdOrThrow,
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow,
  toUserSessionIdOrThrow,
  UserAccountStatus,
  UserAuthProvider,
  UserRole,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedUserStorage } from './EncryptedUserStorage'
import { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import { UserSession } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedUserStorage', () => {
  let mockEncryptedSettings: EncryptedSettingsMock
  let storage: EncryptedUserStorage

  const dummyUser: UserDetails = {
    id: toUserIdOrThrow('usr_123'),
    role: UserRole.CLIENT_USER,
    accountStatus: UserAccountStatus.ACTIVE,
    accountStatusOnRestore: null,
    authorityLevel: 1,
    permissionCodes: [],
    isTotpEnabled: false,
    lastLoginAt: Date.now(),
    lastActiveAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: null,
    scheduledPermanentDeletionAt: null,
    accountLockoutType: AccountLockoutType.NONE,
    temporaryLockoutUntil: null
  }

  const dummySession1: UserSession = {
    id: toUserSessionIdOrThrow('sess_1'),
    userId: toUserIdOrThrow('usr_123'),
    userRole: UserRole.CLIENT_USER,
    identifier: 'user@example.com',
    identifierId: toUserIdentifierIdOrThrow('ident_1'),
    identifierDisplayName: 'User',
    identifierAuthProvider: UserAuthProvider.EMAIL,
    deviceInfo: {
      clientType: ClientType.WEB,
      language: 'en',
      deviceId: toClientDeviceIdOrThrow('dev_1'),
      deviceName: 'Chrome',
      appVersion: '1.0.0',
      operationSystemVersion: 'macOS'
    },
    userAgent: 'Mozilla/5.0',
    ipAddress: '127.0.0.1',
    expiresAt: Date.now() + 10000,
    lastAccessedAt: 100,
    lastReauthenticatedAt: 50,
    isSensitiveValuesMasked: false,
    createdAt: 10,
    updatedAt: 20
  }

  const dummySession2: UserSession = {
    ...dummySession1,
    id: toUserSessionIdOrThrow('sess_2'),
    lastAccessedAt: 200,
    lastReauthenticatedAt: 150,
    createdAt: 30,
    updatedAt: 40
  }

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

  it('sorts sessions by LAST_REAUTHENTICATED_AT and UPDATED_AT', async () => {
    await storage.addUserSession(dummySession1)
    await storage.addUserSession(dummySession2)

    const sortedByReauth = await storage.getUserSessionsList(
      1,
      10,
      UserSortValues.UserSessionSortBy.LAST_REAUTHENTICATED_AT
    )
    expect(sortedByReauth.items[0]?.id).toBe('sess_1')

    const sortedByUpdatedDesc = await storage.getUserSessionsList(
      1,
      10,
      UserSortValues.UserSessionSortBy.UPDATED_AT,
      undefined
    )
    expect(sortedByUpdatedDesc.items[0]?.id).toBe('sess_1')
  })
})
