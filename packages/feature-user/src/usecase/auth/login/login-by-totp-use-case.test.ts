import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestAuthData } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByTotpUseCase } from '@/usecase/auth/login/login-by-totp-use-case'
import { LoginRepositoryMock } from '@/mock/repository/auth/login/login-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'

describe('LoginByTotpUseCase', () => {
  let mockLoginRepository: LoginRepositoryMock
  let mockAuthStorage: AuthStorageMock
  let mockUserStorage: UserStorageMock
  let useCase: LoginByTotpUseCase

  const mockAuthData = createTestAuthData()

  beforeEach(() => {
    mockLoginRepository = new LoginRepositoryMock()
    mockLoginRepository.authDataResultProvider = async () => appResultSuccess(mockAuthData)
    mockAuthStorage = new AuthStorageMock()
    mockUserStorage = new UserStorageMock()

    useCase = new LoginByTotpUseCase(mockLoginRepository, mockAuthStorage, mockUserStorage)
  })

  it('updates authStorage and userStorage on successful TOTP login', async () => {
    const result = await useCase.execute('mfa-token-123', '654321')

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockAuthData)
    }
    expect(mockLoginRepository.lastMfaToken).toBe('mfa-token-123')
    expect(mockLoginRepository.lastCode).toBe('654321')
  })

  it('does not update storage when repository TOTP login fails', async () => {
    const expectedError = CommonError.unknown()
    mockLoginRepository.authDataResultProvider = async () => appResultFailure(expectedError)
    const updateTokensSpy = vi.spyOn(mockAuthStorage, 'updateTokens')
    const updateUserSpy = vi.spyOn(mockUserStorage, 'updateCurrentUser')

    const result = await useCase.execute('mfa-token-123', '000000')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
    expect(updateTokensSpy).not.toHaveBeenCalled()
    expect(updateUserSpy).not.toHaveBeenCalled()
  })
})
