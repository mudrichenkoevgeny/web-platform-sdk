import { describe, it, expect, beforeEach } from 'vitest'
import { TEST_EMAIL, createTestUserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ResetEmailPasswordUseCase } from '@/usecase/auth/reset-password/reset-email-password-use-case'
import { ResetPasswordRepositoryMock } from '@/mock/repository/auth/reset-password/reset-password-repository-mock'

describe('ResetEmailPasswordUseCase', () => {
  let mockRepository: ResetPasswordRepositoryMock
  let useCase: ResetEmailPasswordUseCase

  const mockIdentifier = createTestUserIdentifierPrivate()

  beforeEach(() => {
    mockRepository = new ResetPasswordRepositoryMock()
    mockRepository.resetResult = appResultSuccess(mockIdentifier)
    useCase = new ResetEmailPasswordUseCase(mockRepository)
  })

  it('resets password via resetPasswordRepository on success', async () => {
    const result = await useCase.execute(TEST_EMAIL, 'newPass123', '111222')

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockIdentifier)
    }
    expect(mockRepository.lastResetEmail).toBe(TEST_EMAIL)
    expect(mockRepository.lastResetPassword).toBe('newPass123')
    expect(mockRepository.lastResetCode).toBe('111222')
  })

  it('returns failure when reset password fails', async () => {
    const expectedError = CommonError.unknown()
    mockRepository.resetResult = appResultFailure(expectedError)

    const result = await useCase.execute(TEST_EMAIL, 'newPass123', 'wrong-code')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
