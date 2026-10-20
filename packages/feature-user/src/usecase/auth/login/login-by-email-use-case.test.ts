import { describe, it, expect, beforeEach } from 'vitest'
import { TEST_EMAIL, createTestAuthData } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByEmailUseCase } from '@/usecase/auth/login/login-by-email-use-case'
import { LoginRepositoryMock } from '@/mock/repository/auth/login/login-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'

describe('LoginByEmailUseCase', () => {
  let mockLoginRepository: LoginRepositoryMock
  let mockAuthStorage: AuthStorageMock
  let mockUserStorage: UserStorageMock
  let useCase: LoginByEmailUseCase

  const mockAuthData: AuthData = createTestAuthData()

  beforeEach(() => {
    mockLoginRepository = new LoginRepositoryMock()
    mockLoginRepository.authDataResultProvider = async () => appResultSuccess(mockAuthData)

    mockAuthStorage = new AuthStorageMock()
    mockUserStorage = new UserStorageMock()

    useCase = new LoginByEmailUseCase(mockLoginRepository, mockAuthStorage, mockUserStorage)
  })

  it('updates authStorage and userStorage on successful login', async () => {
    const result = await useCase.execute(TEST_EMAIL, 'password123')

    expect(isSuccess(result)).toBe(true)
    expect(mockLoginRepository.lastEmail).toBe(TEST_EMAIL)
    expect(mockLoginRepository.lastPassword).toBe('password123')
  })
})
