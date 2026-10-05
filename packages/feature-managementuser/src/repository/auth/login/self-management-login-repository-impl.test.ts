import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementLoginRepositoryImpl } from '@/repository/auth/login/SelfManagementLoginRepositoryImpl'
import type { SelfManagementLoginApi } from '@/network/api/auth/login/SelfManagementLoginApi'

describe('SelfManagementLoginRepositoryImpl', () => {
  let mockApi: SelfManagementLoginApi
  let repository: SelfManagementLoginRepositoryImpl

  const dummyAuthPayload = {
    user: {
      id: 'usr_mgmt_1',
      role: 'SUPER_ADMIN',
      account_status: 'ACTIVE',
      account_status_on_restore: null,
      authority_level: 100,
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
      loginByTotp: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthPayload)),
      loginByTotpRecoveryCode: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthPayload))
    } as unknown as SelfManagementLoginApi

    repository = new SelfManagementLoginRepositoryImpl(mockApi)
  })

  it('delegates loginByEmail and maps response', async () => {
    const result = await repository.loginByEmail('admin@example.com', 'secret')
    expect(mockApi.loginByEmail).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'secret' })
    expect(isSuccess(result)).toBe(true)
  })

  it('returns contract violation for loginByPhone', async () => {
    const result = await repository.loginByPhone('+1234567890', '123456')
    expect(isFailure(result)).toBe(true)
  })

  it('returns contract violation for loginByExternalAuthProvider', async () => {
    const result = await repository.loginByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token')
    expect(isFailure(result)).toBe(true)
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

  it('returns contract violation for sendLoginConfirmationToPhone', async () => {
    const result = await repository.sendLoginConfirmationToPhone('+1234567890')
    expect(isFailure(result)).toBe(true)
  })

  it('returns 0 for remaining confirmation delay', () => {
    expect(repository.getRemainingLoginConfirmationDelayInSeconds('+1234567890')).toBe(0)
  })
})
