import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { OpenLoginRepositoryImpl } from '@/repository/auth/login/open-login-repository-impl'
import type { OpenLoginApi } from '@/network/api/auth/login/open-login-api'
import type { ConfirmationRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenLoginRepositoryImpl', () => {
  let mockApi: OpenLoginApi
  let mockConfirmationRepo: ConfirmationRepository
  let repository: OpenLoginRepositoryImpl

  const dummyAuthPayload = {
    user: {
      id: 'usr_1',
      role: 'CLIENT_USER',
      account_status: 'ACTIVE',
      account_status_on_restore: null,
      authority_level: 1,
      permission_codes: [],
      is_totp_enabled: false,
      last_login_at: 1000,
      last_active_at: 1000,
      created_at: 500,
      updated_at: null,
      scheduled_permanent_deletion_at: null,
      account_lockout_type: 'NONE',
      temporary_lockout_until: null
    },
    session_token: {
      access_token: 'access_123',
      refresh_token: 'refresh_123',
      expires_at: 3600,
      token_type: 'Bearer',
      session_id: 'sess_1',
      identifier_id: 'ident_1'
    }
  } as any

  beforeEach(() => {
    mockApi = {
      loginByEmail: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthPayload)),
      loginByPhone: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthPayload)),
      loginByExternalAuthProvider: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthPayload)),
      loginByTotp: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthPayload)),
      loginByTotpRecoveryCode: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthPayload)),
      sendLoginConfirmationToPhone: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 }))
    } as unknown as OpenLoginApi

    mockConfirmationRepo = {
      executeWithTimer: vi.fn().mockImplementation((_type, _identifier, action) => action()),
      getRemainingDelay: vi.fn().mockReturnValue(0)
    } as unknown as ConfirmationRepository

    repository = new OpenLoginRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates loginByEmail and maps response', async () => {
    const result = await repository.loginByEmail('test@example.com', 'secret')
    expect(mockApi.loginByEmail).toHaveBeenCalledWith({ email: 'test@example.com', password: 'secret' })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates loginByPhone and maps response', async () => {
    const result = await repository.loginByPhone('+1234567890', '123456')
    expect(mockApi.loginByPhone).toHaveBeenCalledWith({ phone_number: '+1234567890', confirmation_code: '123456' })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates loginByExternalAuthProvider and maps response', async () => {
    const result = await repository.loginByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token_xyz')
    expect(mockApi.loginByExternalAuthProvider).toHaveBeenCalledWith({
      auth_provider: UserAuthProvider.GOOGLE,
      external_provider_token: 'token_xyz'
    })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates loginByTotp and maps response', async () => {
    const result = await repository.loginByTotp('mfa_123', '654321')
    expect(mockApi.loginByTotp).toHaveBeenCalledWith({ mfa_token: 'mfa_123', totp_code: '654321' })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates loginByTotpRecoveryCode and maps response', async () => {
    const result = await repository.loginByTotpRecoveryCode('mfa_123', 'rec_123')
    expect(mockApi.loginByTotpRecoveryCode).toHaveBeenCalledWith({ mfa_token: 'mfa_123', totp_code: 'rec_123' })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendLoginConfirmationToPhone with timer', async () => {
    const result = await repository.sendLoginConfirmationToPhone('+1234567890')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining cooldown delay', () => {
    const delay = repository.getRemainingLoginConfirmationDelayInSeconds('+1234567890')
    expect(delay).toBe(0)
  })
})
