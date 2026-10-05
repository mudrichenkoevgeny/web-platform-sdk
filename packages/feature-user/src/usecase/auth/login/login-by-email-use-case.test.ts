import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  AccountLockoutType,
  toAccessTokenOrThrow,
  toRefreshTokenOrThrow,
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow,
  toUserSessionIdOrThrow,
  UserAccountStatus,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByEmailUseCase } from '@/usecase/auth/login/LoginByEmailUseCase'
import type { LoginRepository } from '@/repository/auth/login/LoginRepository'
import type { AuthStorage } from '@/storage/auth/AuthStorage'
import type { UserStorage } from '@/storage/user/UserStorage'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'

describe('LoginByEmailUseCase', () => {
  let mockLoginRepository: LoginRepository
  let mockAuthStorage: AuthStorage
  let mockUserStorage: UserStorage
  let useCase: LoginByEmailUseCase

  const dummyAuthData: AuthData = {
    userDetails: {
      id: toUserIdOrThrow('usr_1'),
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
      lockoutType: AccountLockoutType.NONE,
      temporaryLockoutUntil: null
    },
    sessionToken: {
      accessToken: toAccessTokenOrThrow('access_123'),
      refreshToken: toRefreshTokenOrThrow('refresh_123'),
      expiresAt: Date.now() + 3600000,
      tokenType: 'Bearer',
      sessionId: toUserSessionIdOrThrow('sess_1'),
      identifierId: toUserIdentifierIdOrThrow('ident_1')
    }
  }

  beforeEach(() => {
    mockLoginRepository = {
      loginByEmail: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthData))
    } as unknown as LoginRepository

    mockAuthStorage = {
      updateTokens: vi.fn().mockResolvedValue(undefined)
    } as unknown as AuthStorage

    mockUserStorage = {
      updateCurrentUser: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    useCase = new LoginByEmailUseCase(mockLoginRepository, mockAuthStorage, mockUserStorage)
  })

  it('updates authStorage and userStorage on successful login', async () => {
    const result = await useCase.execute('test@example.com', 'password123')

    expect(isSuccess(result)).toBe(true)
    expect(mockAuthStorage.updateTokens).toHaveBeenCalledWith(dummyAuthData.sessionToken)
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalledWith(dummyAuthData.userDetails)
  })
})
