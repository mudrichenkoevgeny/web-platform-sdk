import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierPrivatePayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { SelfManagementResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/self-management-reset-password-repository-impl'
import type { ConfirmationRepository, ResetPasswordApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementResetPasswordRepositoryImpl', () => {
  let mockApi: ResetPasswordApi
  let mockConfirmationRepo: ConfirmationRepository
  let repository: SelfManagementResetPasswordRepositoryImpl

  const dummyIdentifierPayload = userIdentifierPrivatePayloadMock()

  beforeEach(() => {
    mockApi = {
      resetPassword: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifierPayload)),
      sendResetPasswordConfirmationToEmail: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 }))
    } as unknown as ResetPasswordApi

    mockConfirmationRepo = {
      executeWithTimer: vi.fn().mockImplementation((_type, _identifier, action) => action()),
      getRemainingDelay: vi.fn().mockReturnValue(0)
    } as unknown as ConfirmationRepository

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
