import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenRegistrationRepositoryImpl } from '@/repository/auth/registration/OpenRegistrationRepositoryImpl'
import type { RegistrationApi } from '@/network/api/auth/registration/RegistrationApi'
import type { ConfirmationRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenRegistrationRepositoryImpl', () => {
  let mockApi: RegistrationApi
  let mockConfirmationRepo: ConfirmationRepository
  let repository: OpenRegistrationRepositoryImpl

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
      registerByEmail: vi.fn().mockResolvedValue(appResultSuccess(dummyAuthPayload)),
      sendRegistrationConfirmationToEmail: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 }))
    } as unknown as RegistrationApi

    mockConfirmationRepo = {
      executeWithTimer: vi.fn().mockImplementation((_type, _identifier, action) => action()),
      getRemainingDelay: vi.fn().mockReturnValue(0)
    } as unknown as ConfirmationRepository

    repository = new OpenRegistrationRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates registerByEmail and maps response to AuthData', async () => {
    const result = await repository.registerByEmail('user@example.com', 'secret', '123456')
    expect(mockApi.registerByEmail).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret',
      confirmation_code: '123456'
    })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendRegistrationConfirmationToEmail with timer', async () => {
    const result = await repository.sendRegistrationConfirmationToEmail('user@example.com')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining cooldown delay', () => {
    const delay = repository.getRemainingRegistrationConfirmationDelayInSeconds('user@example.com')
    expect(delay).toBe(0)
  })
})
