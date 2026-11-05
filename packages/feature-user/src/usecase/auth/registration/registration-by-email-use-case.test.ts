import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TEST_EMAIL, createTestAuthData } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RegistrationByEmailUseCase } from '@/usecase/auth/registration/registration-by-email-use-case'
import { RegistrationRepositoryMock } from '@/mock/repository/auth/registration/registration-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'

describe('RegistrationByEmailUseCase', () => {
  let mockRegistrationRepository: RegistrationRepositoryMock
  let mockAuthStorage: AuthStorageMock
  let mockUserStorage: UserStorageMock
  let useCase: RegistrationByEmailUseCase

  const mockAuthData = createTestAuthData()

  beforeEach(() => {
    mockRegistrationRepository = new RegistrationRepositoryMock()
    mockRegistrationRepository.authDataResultProvider = async () => appResultSuccess(mockAuthData)
    mockAuthStorage = new AuthStorageMock()
    mockUserStorage = new UserStorageMock()

    useCase = new RegistrationByEmailUseCase(mockRegistrationRepository, mockAuthStorage, mockUserStorage)
  })

  it('registers account and updates storage on success', async () => {
    const result = await useCase.execute(TEST_EMAIL, 'pass123', '999888')

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockAuthData)
    }
    expect(mockRegistrationRepository.lastEmail).toBe(TEST_EMAIL)
    expect(mockRegistrationRepository.lastPassword).toBe('pass123')
    expect(mockRegistrationRepository.lastConfirmationCode).toBe('999888')
  })

  it('does not update storage when registration fails', async () => {
    const expectedError = CommonError.unknown()
    mockRegistrationRepository.authDataResultProvider = async () => appResultFailure(expectedError)
    const updateTokensSpy = vi.spyOn(mockAuthStorage, 'updateTokens')
    const updateUserSpy = vi.spyOn(mockUserStorage, 'updateCurrentUser')

    const result = await useCase.execute(TEST_EMAIL, 'pass123', 'invalid-code')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
    expect(updateTokensSpy).not.toHaveBeenCalled()
    expect(updateUserSpy).not.toHaveBeenCalled()
  })
})
