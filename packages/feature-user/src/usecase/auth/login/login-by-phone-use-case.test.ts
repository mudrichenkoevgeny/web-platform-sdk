import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TEST_PHONE, createTestAuthData } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByPhoneUseCase } from '@/usecase/auth/login/login-by-phone-use-case'
import { LoginRepositoryMock } from '@/mock/repository/auth/login/login-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'

describe('LoginByPhoneUseCase', () => {
  let mockLoginRepository: LoginRepositoryMock
  let mockAuthStorage: AuthStorageMock
  let mockUserStorage: UserStorageMock
  let useCase: LoginByPhoneUseCase

  const mockAuthData = createTestAuthData()

  beforeEach(() => {
    mockLoginRepository = new LoginRepositoryMock()
    mockLoginRepository.authDataResultProvider = async () => appResultSuccess(mockAuthData)
    mockAuthStorage = new AuthStorageMock()
    mockUserStorage = new UserStorageMock()

    useCase = new LoginByPhoneUseCase(mockLoginRepository, mockAuthStorage, mockUserStorage)
  })

  it('updates authStorage and userStorage on successful phone login', async () => {
    const result = await useCase.execute(TEST_PHONE, '123456')

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockAuthData)
    }
    expect(mockLoginRepository.lastPhoneNumber).toBe(TEST_PHONE)
    expect(mockLoginRepository.lastConfirmationCode).toBe('123456')
  })

  it('does not update storage when repository phone login fails', async () => {
    const expectedError = CommonError.unknown()
    mockLoginRepository.authDataResultProvider = async () => appResultFailure(expectedError)
    const updateTokensSpy = vi.spyOn(mockAuthStorage, 'updateTokens')
    const updateUserSpy = vi.spyOn(mockUserStorage, 'updateCurrentUser')

    const result = await useCase.execute(TEST_PHONE, 'wrong-code')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
    expect(updateTokensSpy).not.toHaveBeenCalled()
    expect(updateUserSpy).not.toHaveBeenCalled()
  })
})
