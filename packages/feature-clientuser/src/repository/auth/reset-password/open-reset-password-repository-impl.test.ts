import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, toUserIdentifierPrivatePayload, createTestUserIdentifierPrivate, createTestOtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/open-reset-password-repository-impl'
import { ResetPasswordApiMock, ConfirmationRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenResetPasswordRepositoryImpl', () => {
  let mockApi: ResetPasswordApiMock
  let mockConfirmationRepo: ConfirmationRepositoryMock
  let repository: OpenResetPasswordRepositoryImpl

  const mockIdentifierPayload = toUserIdentifierPrivatePayload(createTestUserIdentifierPrivate())

  beforeEach(() => {
    mockApi = new ResetPasswordApiMock()
    mockApi.resetPasswordResult = appResultSuccess(mockIdentifierPayload)
    mockApi.sendResetPasswordConfirmationToEmailResult = appResultSuccess(createTestOtpConfirmationPayload())

    vi.spyOn(mockApi, 'resetPassword')
    vi.spyOn(mockApi, 'sendResetPasswordConfirmationToEmail')

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer')

    repository = new OpenResetPasswordRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates resetPassword and maps response to UserIdentifier', async () => {
    const resetResult = await repository.resetPassword(TEST_EMAIL, 'new_secret', '123456')
    expect(mockApi.resetPassword).toHaveBeenCalledWith({
      email: TEST_EMAIL,
      new_password: 'new_secret',
      confirmation_code: '123456'
    })
    expect(isSuccess(resetResult)).toBe(true)
  })

  it('delegates sendResetPasswordConfirmationToEmail with timer', async () => {
    const sendConfirmationResult = await repository.sendResetPasswordConfirmationToEmail(TEST_EMAIL)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(sendConfirmationResult)).toBe(true)
  })

  it('queries remaining cooldown delay', () => {
    const delay = repository.getRemainingResetPasswordConfirmationDelayInSeconds(TEST_EMAIL)
    expect(delay).toBe(0)
  })
})
