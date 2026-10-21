import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, TEST_PHONE, UserAuthProvider, createTestAuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementLoginRepositoryImpl } from '@/repository/auth/login/self-management-login-repository-impl'
import { SelfManagementLoginApiMock } from '@/mock/network/api/auth/login/self-management-login-api-mock'

describe('SelfManagementLoginRepositoryImpl', () => {
  let mockApi: SelfManagementLoginApiMock
  let repository: SelfManagementLoginRepositoryImpl

  const mockAuthPayload = createTestAuthDataPayload()

  beforeEach(() => {
    mockApi = new SelfManagementLoginApiMock()
    mockApi.loginByEmailResult = appResultSuccess(mockAuthPayload)
    mockApi.loginByTotpResult = appResultSuccess(mockAuthPayload)
    mockApi.loginByTotpRecoveryCodeResult = appResultSuccess(mockAuthPayload)

    vi.spyOn(mockApi, 'loginByEmail')
    vi.spyOn(mockApi, 'loginByTotp')
    vi.spyOn(mockApi, 'loginByTotpRecoveryCode')

    repository = new SelfManagementLoginRepositoryImpl(mockApi)
  })

  it('delegates loginByEmail and maps response', async () => {
    const loginResult = await repository.loginByEmail(TEST_EMAIL, 'secret')
    expect(mockApi.loginByEmail).toHaveBeenCalledWith(TEST_EMAIL, 'secret')
    expect(isSuccess(loginResult)).toBe(true)
  })

  it('returns contract violation for loginByPhone', async () => {
    const loginResult = await repository.loginByPhone(TEST_PHONE, '123456')
    expect(isFailure(loginResult)).toBe(true)
  })

  it('returns contract violation for loginByExternalAuthProvider', async () => {
    const loginResult = await repository.loginByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token')
    expect(isFailure(loginResult)).toBe(true)
  })

  it('delegates loginByTotp and maps response', async () => {
    const loginResult = await repository.loginByTotp('mfa_123', '654321')
    expect(mockApi.loginByTotp).toHaveBeenCalledWith('mfa_123', '654321')
    expect(isSuccess(loginResult)).toBe(true)
  })

  it('delegates loginByTotpRecoveryCode and maps response', async () => {
    const loginResult = await repository.loginByTotpRecoveryCode('mfa_123', 'rec_123')
    expect(mockApi.loginByTotpRecoveryCode).toHaveBeenCalledWith('mfa_123', 'rec_123')
    expect(isSuccess(loginResult)).toBe(true)
  })

  it('returns contract violation for sendLoginConfirmationToPhone', async () => {
    const sendConfirmationResult = await repository.sendLoginConfirmationToPhone(TEST_PHONE)
    expect(isFailure(sendConfirmationResult)).toBe(true)
  })

  it('returns 0 for remaining confirmation delay', () => {
    expect(repository.getRemainingLoginConfirmationDelayInSeconds(TEST_PHONE)).toBe(0)
  })
})
