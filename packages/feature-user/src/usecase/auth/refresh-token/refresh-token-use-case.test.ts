import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  toAccessTokenOrThrow,
  toRefreshTokenOrThrow,
  toUserIdentifierIdOrThrow,
  toUserSessionIdOrThrow,
  UserErrorCodes
} from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RefreshTokenUseCase } from '@/usecase/auth/refresh-token/refresh-token-use-case'
import type { RefreshTokenRepository } from '@/repository/auth/refresh-token/refresh-token-repository'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import type { SessionToken } from '@mudrichenkoevgeny/shared-foundation'

describe('RefreshTokenUseCase', () => {
  let mockRepository: RefreshTokenRepository
  let mockAuthStorage: AuthStorage
  let useCase: RefreshTokenUseCase

  const dummySessionToken: SessionToken = {
    accessToken: toAccessTokenOrThrow('new_access_123'),
    refreshToken: toRefreshTokenOrThrow('new_refresh_123'),
    expiresAt: Date.now() + 3600000,
    tokenType: 'Bearer',
    sessionId: toUserSessionIdOrThrow('sess_1'),
    identifierId: toUserIdentifierIdOrThrow('ident_1')
  }

  beforeEach(() => {
    mockRepository = {
      refreshToken: vi.fn().mockResolvedValue(appResultSuccess(dummySessionToken))
    } as unknown as RefreshTokenRepository

    mockAuthStorage = {
      getRefreshToken: vi.fn().mockResolvedValue('old_refresh_123'),
      updateTokens: vi.fn().mockResolvedValue(undefined)
    } as unknown as AuthStorage

    useCase = new RefreshTokenUseCase(mockRepository, mockAuthStorage)
  })

  it('fails with InvalidRefreshToken if no refresh token is stored', async () => {
    mockAuthStorage.getRefreshToken = vi.fn().mockResolvedValue(null)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toBe(UserErrorCodes.INVALID_REFRESH_TOKEN)
    }
  })

  it('exchanges refresh token and updates authStorage on success', async () => {
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    expect(mockRepository.refreshToken).toHaveBeenCalledWith('old_refresh_123')
    expect(mockAuthStorage.updateTokens).toHaveBeenCalledWith(dummySessionToken)
  })
})
