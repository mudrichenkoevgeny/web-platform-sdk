import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfManagementUserSecurityRepositoryImpl } from '@/repository/user/security/SelfManagementUserSecurityRepositoryImpl'
import type { UserSecurityApi, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementUserSecurityRepositoryImpl', () => {
  let mockApi: UserSecurityApi
  let mockUserStorage: UserStorage
  let repository: SelfManagementUserSecurityRepositoryImpl

  const dummyTotpSetupPayload = {
    secret_key: 'secret',
    uri: 'otpauth://uri'
  } as any

  const dummyTotpRecoveryCodesPayload = {
    recovery_codes: ['code1', 'code2']
  } as any

  const dummyUser = {
    id: 'usr_1',
    isTotpEnabled: false
  } as any

  beforeEach(() => {
    vi.clearAllMocks()

    mockApi = {
      setupTotp: vi.fn().mockResolvedValue(appResultSuccess(dummyTotpSetupPayload)),
      enableTotp: vi.fn().mockResolvedValue(appResultSuccess(dummyTotpRecoveryCodesPayload)),
      disableTotp: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      getRecoveryCodes: vi.fn().mockResolvedValue(appResultSuccess(dummyTotpRecoveryCodesPayload)),
      regenerateRecoveryCodes: vi.fn().mockResolvedValue(appResultSuccess(dummyTotpRecoveryCodesPayload))
    } as unknown as UserSecurityApi

    mockUserStorage = {
      getCurrentUser: vi.fn().mockResolvedValue(dummyUser),
      updateCurrentUser: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    repository = new SelfManagementUserSecurityRepositoryImpl(mockApi, mockUserStorage)
  })

  it('delegates setupTotp to API', async () => {
    const result = await repository.setupTotp()
    expect(mockApi.setupTotp).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates enableTotp and updates TOTP status in storage', async () => {
    const result = await repository.enableTotp('mfaToken', '123456')
    expect(mockApi.enableTotp).toHaveBeenCalledWith({
      mfa_token: 'mfaToken',
      totp_code: '123456'
    })
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalledWith({
      ...dummyUser,
      isTotpEnabled: true
    })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates disableTotp and updates TOTP status in storage', async () => {
    const result = await repository.disableTotp()
    expect(mockApi.disableTotp).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalledWith({
      ...dummyUser,
      isTotpEnabled: false
    })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getRecoveryCodes to API', async () => {
    const result = await repository.getRecoveryCodes()
    expect(mockApi.getRecoveryCodes).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates regenerateRecoveryCodes to API', async () => {
    const result = await repository.regenerateRecoveryCodes()
    expect(mockApi.regenerateRecoveryCodes).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })
})
