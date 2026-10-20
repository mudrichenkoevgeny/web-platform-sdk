import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TEST_REFRESH_TOKEN, toSessionToken, toRefreshTokenOrThrow, UserErrorCodes, createTestSessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RefreshTokenUseCase } from '@/usecase/auth/refresh-token/refresh-token-use-case'
import { RefreshTokenRepositoryMock } from '@/mock/repository/auth/refresh-token/refresh-token-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import type { SessionToken } from '@mudrichenkoevgeny/shared-foundation'

describe('RefreshTokenUseCase', () => {
  let mockRepository: RefreshTokenRepositoryMock
  let mockAuthStorage: AuthStorageMock
  let useCase: RefreshTokenUseCase

  const mockSessionToken: SessionToken = toSessionToken(createTestSessionTokenPayload())

  beforeEach(() => {
    mockRepository = new RefreshTokenRepositoryMock()
    mockRepository.refreshTokenResultProvider = async () => appResultSuccess(mockSessionToken)

    mockAuthStorage = new AuthStorageMock()
    vi.spyOn(mockAuthStorage, 'getRefreshToken').mockResolvedValue(toRefreshTokenOrThrow(TEST_REFRESH_TOKEN))
    vi.spyOn(mockAuthStorage, 'updateTokens').mockResolvedValue(undefined)

    useCase = new RefreshTokenUseCase(mockRepository, mockAuthStorage)
  })

  it('fails with InvalidRefreshToken if no refresh token is stored', async () => {
    vi.spyOn(mockAuthStorage, 'getRefreshToken').mockResolvedValue(null)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toBe(UserErrorCodes.INVALID_REFRESH_TOKEN)
    }
  })

  it('exchanges refresh token and updates authStorage on success', async () => {
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    expect(mockRepository.lastRefreshToken).toBe(toRefreshTokenOrThrow(TEST_REFRESH_TOKEN))
    expect(mockAuthStorage.isTokensCleared).toBe(false)
  })
})
