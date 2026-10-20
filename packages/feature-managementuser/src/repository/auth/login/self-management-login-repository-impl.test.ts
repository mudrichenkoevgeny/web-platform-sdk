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

    vi.spyOn(mockApi, 'loginByEmail').mockImplementation(mockApi.loginByEmail.bind(mockApi))
    vi.spyOn(mockApi, 'loginByTotp').mockImplementation(mockApi.loginByTotp.bind(mockApi))
    vi.spyOn(mockApi, 'loginByTotpRecoveryCode').mockImplementation(mockApi.loginByTotpRecoveryCode.bind(mockApi))

    repository = new SelfManagementLoginRepositoryImpl(mockApi)
  })

  it('delegates loginByEmail and maps response', async () => {
    const result = await repository.loginByEmail(TEST_EMAIL, 'secret')
    expect(mockApi.loginByEmail).toHaveBeenCalledWith(TEST_EMAIL, 'secret')
    expect(isSuccess(result)).toBe(true)
  })

  it('returns contract violation for loginByPhone', async () => {
    const result = await repository.loginByPhone(TEST_PHONE, '123456')
    expect(isFailure(result)).toBe(true)
  })

  it('returns contract violation for loginByExternalAuthProvider', async () => {
    const result = await repository.loginByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token')
    expect(isFailure(result)).toBe(true)
  })

  it('delegates loginByTotp and maps response', async () => {
    const result = await repository.loginByTotp('mfa_123', '654321')
    expect(mockApi.loginByTotp).toHaveBeenCalledWith('mfa_123', '654321')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates loginByTotpRecoveryCode and maps response', async () => {
    const result = await repository.loginByTotpRecoveryCode('mfa_123', 'rec_123')
    expect(mockApi.loginByTotpRecoveryCode).toHaveBeenCalledWith('mfa_123', 'rec_123')
    expect(isSuccess(result)).toBe(true)
  })

  it('returns contract violation for sendLoginConfirmationToPhone', async () => {
    const result = await repository.sendLoginConfirmationToPhone(TEST_PHONE)
    expect(isFailure(result)).toBe(true)
  })

  it('returns 0 for remaining confirmation delay', () => {
    expect(repository.getRemainingLoginConfirmationDelayInSeconds(TEST_PHONE)).toBe(0)
  })
})
