import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, TEST_PHONE, UserAuthProvider, createTestAuthDataPayload, createTestOtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenLoginRepositoryImpl } from '@/repository/auth/login/open-login-repository-impl'
import { OpenLoginApiMock } from '@/mock/network/api/auth/login/open-login-api-mock'
import { ConfirmationRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenLoginRepositoryImpl', () => {
  let mockApi: OpenLoginApiMock
  let mockConfirmationRepo: ConfirmationRepositoryMock
  let repository: OpenLoginRepositoryImpl

  const mockAuthPayload = createTestAuthDataPayload()

  beforeEach(() => {
    mockApi = new OpenLoginApiMock()
    mockApi.loginByEmailResult = appResultSuccess(mockAuthPayload)
    mockApi.loginByPhoneResult = appResultSuccess(mockAuthPayload)
    mockApi.loginByExternalAuthProviderResult = appResultSuccess(mockAuthPayload)
    mockApi.loginByTotpResult = appResultSuccess(mockAuthPayload)
    mockApi.loginByTotpRecoveryCodeResult = appResultSuccess(mockAuthPayload)
    mockApi.sendLoginConfirmationToPhoneResult = appResultSuccess(createTestOtpConfirmationPayload())

    vi.spyOn(mockApi, 'loginByEmail')
    vi.spyOn(mockApi, 'loginByPhone')
    vi.spyOn(mockApi, 'loginByExternalAuthProvider')
    vi.spyOn(mockApi, 'loginByTotp')
    vi.spyOn(mockApi, 'loginByTotpRecoveryCode')
    vi.spyOn(mockApi, 'sendLoginConfirmationToPhone')

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer')

    repository = new OpenLoginRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates loginByEmail and maps response', async () => {
    const loginResult = await repository.loginByEmail(TEST_EMAIL, 'secret')
    expect(mockApi.loginByEmail).toHaveBeenCalledWith(TEST_EMAIL, 'secret')
    expect(mockApi.lastLoginByEmailRequest).toEqual({ email: TEST_EMAIL, password: 'secret' })
    expect(isSuccess(loginResult)).toBe(true)
  })

  it('delegates loginByPhone and maps response', async () => {
    const loginResult = await repository.loginByPhone(TEST_PHONE, '123456')
    expect(mockApi.loginByPhone).toHaveBeenCalledWith(TEST_PHONE, '123456')
    expect(mockApi.lastLoginByPhoneRequest).toEqual({ phone_number: TEST_PHONE, confirmation_code: '123456' })
    expect(isSuccess(loginResult)).toBe(true)
  })

  it('delegates loginByExternalAuthProvider and maps response', async () => {
    const loginResult = await repository.loginByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token_xyz')
    expect(mockApi.loginByExternalAuthProvider).toHaveBeenCalledWith(UserAuthProvider.GOOGLE, 'token_xyz')
    expect(mockApi.lastLoginByExternalAuthProviderRequest).toEqual({ auth_provider: UserAuthProvider.GOOGLE, external_provider_token: 'token_xyz' })
    expect(isSuccess(loginResult)).toBe(true)
  })

  it('delegates loginByTotp and maps response', async () => {
    const loginResult = await repository.loginByTotp('mfa_123', '654321')
    expect(mockApi.loginByTotp).toHaveBeenCalledWith('mfa_123', '654321')
    expect(mockApi.lastLoginByTotpRequest).toEqual({ mfa_token: 'mfa_123', totp_code: '654321' })
    expect(isSuccess(loginResult)).toBe(true)
  })

  it('delegates loginByTotpRecoveryCode and maps response', async () => {
    const loginResult = await repository.loginByTotpRecoveryCode('mfa_123', 'rec_123')
    expect(mockApi.loginByTotpRecoveryCode).toHaveBeenCalledWith('mfa_123', 'rec_123')
    expect(mockApi.lastLoginByTotpRecoveryCodeRequest).toEqual({ mfa_token: 'mfa_123', totp_code: 'rec_123' })
    expect(isSuccess(loginResult)).toBe(true)
  })

  it('delegates sendLoginConfirmationToPhone with timer', async () => {
    const sendConfirmationResult = await repository.sendLoginConfirmationToPhone(TEST_PHONE)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(mockApi.lastSendLoginConfirmationToPhoneRequest).toEqual({ phone_number: TEST_PHONE })
    expect(isSuccess(sendConfirmationResult)).toBe(true)
  })

  it('queries remaining cooldown delay', () => {
    const delay = repository.getRemainingLoginConfirmationDelayInSeconds(TEST_PHONE)
    expect(delay).toBe(0)
  })
})
