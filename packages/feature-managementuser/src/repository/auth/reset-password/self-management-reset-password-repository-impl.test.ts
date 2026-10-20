import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserIdentifierPrivatePayload, createTestOtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/self-management-reset-password-repository-impl'
import { SelfManagementResetPasswordApiMock } from '@/mock/network/api/auth/reset-password/self-management-reset-password-api-mock'
import { ConfirmationRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementResetPasswordRepositoryImpl', () => {
  let mockApi: SelfManagementResetPasswordApiMock
  let mockConfirmationRepo: ConfirmationRepositoryMock
  let repository: SelfManagementResetPasswordRepositoryImpl

  const mockIdentifierPayload = createTestUserIdentifierPrivatePayload()

  beforeEach(() => {
    mockApi = new SelfManagementResetPasswordApiMock()
    mockApi.resetPasswordResult = appResultSuccess(mockIdentifierPayload)
    mockApi.sendResetPasswordConfirmationToEmailResult = appResultSuccess(createTestOtpConfirmationPayload())

    vi.spyOn(mockApi, 'resetPassword').mockImplementation(mockApi.resetPassword.bind(mockApi))
    vi.spyOn(mockApi, 'sendResetPasswordConfirmationToEmail').mockImplementation(mockApi.sendResetPasswordConfirmationToEmail.bind(mockApi))

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer').mockImplementation(mockConfirmationRepo.executeWithTimer.bind(mockConfirmationRepo))

    repository = new SelfManagementResetPasswordRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates resetPassword and maps response to UserIdentifierPrivate', async () => {
    const result = await repository.resetPassword('admin@example.com', 'new_secret', '123456')
    expect(mockApi.resetPassword).toHaveBeenCalledWith({
      email: 'admin@example.com',
      new_password: 'new_secret',
      confirmation_code: '123456'
    })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendResetPasswordConfirmationToEmail with timer', async () => {
    const result = await repository.sendResetPasswordConfirmationToEmail('admin@example.com')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining cooldown delay', () => {
    const delay = repository.getRemainingResetPasswordConfirmationDelayInSeconds('admin@example.com')
    expect(delay).toBe(0)
  })
})
