import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/open-reset-password-repository-impl'
import type { ConfirmationRepository, ResetPasswordApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenResetPasswordRepositoryImpl', () => {
  let mockApi: ResetPasswordApi
  let mockConfirmationRepo: ConfirmationRepository
  let repository: OpenResetPasswordRepositoryImpl

  const dummyIdentifierPayload = {
    id: 'ident_1',
    user_id: 'usr_1',
    identifier: 'user@example.com',
    user_auth_provider: 'EMAIL',
    is_primary: true,
    is_confirmed: true,
    created_at: 1000,
    updated_at: null
  } as any

  beforeEach(() => {
    mockApi = {
      resetPassword: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifierPayload)),
      sendResetPasswordConfirmationToEmail: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 }))
    } as unknown as ResetPasswordApi

    mockConfirmationRepo = {
      executeWithTimer: vi.fn().mockImplementation((_type, _identifier, action) => action()),
      getRemainingDelay: vi.fn().mockReturnValue(0)
    } as unknown as ConfirmationRepository

    repository = new OpenResetPasswordRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates resetPassword and maps response to UserIdentifier', async () => {
    const result = await repository.resetPassword('user@example.com', 'new_secret', '123456')
    expect(mockApi.resetPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      new_password: 'new_secret',
      confirmation_code: '123456'
    })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendResetPasswordConfirmationToEmail with timer', async () => {
    const result = await repository.sendResetPasswordConfirmationToEmail('user@example.com')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining cooldown delay', () => {
    const delay = repository.getRemainingResetPasswordConfirmationDelayInSeconds('user@example.com')
    expect(delay).toBe(0)
  })
})
