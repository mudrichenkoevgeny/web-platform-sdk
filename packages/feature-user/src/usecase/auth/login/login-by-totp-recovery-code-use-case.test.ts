import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestAuthData } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByTotpRecoveryCodeUseCase } from '@/usecase/auth/login/login-by-totp-recovery-code-use-case'
import { LoginRepositoryMock } from '@/mock/repository/auth/login/login-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'

describe('LoginByTotpRecoveryCodeUseCase', () => {
  let mockLoginRepository: LoginRepositoryMock
  let mockAuthStorage: AuthStorageMock
  let mockUserStorage: UserStorageMock
  let useCase: LoginByTotpRecoveryCodeUseCase

  const mockAuthData = createTestAuthData()

  beforeEach(() => {
    mockLoginRepository = new LoginRepositoryMock()
    mockLoginRepository.authDataResultProvider = async () => appResultSuccess(mockAuthData)
    mockAuthStorage = new AuthStorageMock()
    mockUserStorage = new UserStorageMock()

    useCase = new LoginByTotpRecoveryCodeUseCase(mockLoginRepository, mockAuthStorage, mockUserStorage)
  })

  it('updates authStorage and userStorage on successful recovery code login', async () => {
    const result = await useCase.execute('mfa-token-123', 'rec-code-123')

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockAuthData)
    }
    expect(mockLoginRepository.lastMfaToken).toBe('mfa-token-123')
    expect(mockLoginRepository.lastCode).toBe('rec-code-123')
  })

  it('does not update storage when repository recovery code login fails', async () => {
    const expectedError = CommonError.unknown()
    mockLoginRepository.authDataResultProvider = async () => appResultFailure(expectedError)
    const updateTokensSpy = vi.spyOn(mockAuthStorage, 'updateTokens')
    const updateUserSpy = vi.spyOn(mockUserStorage, 'updateCurrentUser')

    const result = await useCase.execute('mfa-token-123', 'invalid-code')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
    expect(updateTokensSpy).not.toHaveBeenCalled()
    expect(updateUserSpy).not.toHaveBeenCalled()
  })
})
