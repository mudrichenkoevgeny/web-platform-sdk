import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, createTestTotpSetupPayload, createTestTotpRecoveryCodesPayload, TEST_USER_ID, toUserIdOrThrow, toUserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserSecurityRepositoryImpl } from '@/repository/user/security/open-user-security-repository-impl'
import { UserSecurityApiMock, UserStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenUserSecurityRepositoryImpl', () => {
  let mockApi: UserSecurityApiMock
  let mockStorage: UserStorageMock
  let repository: OpenUserSecurityRepositoryImpl

  const mockUser = toUserPrivate(createTestUserPrivatePayload({
    id: toUserIdOrThrow(TEST_USER_ID),
    is_totp_enabled: false
  }))

  beforeEach(() => {
    mockApi = new UserSecurityApiMock()
    mockApi.setupTotpResult = appResultSuccess(createTestTotpSetupPayload())
    mockApi.enableTotpResult = appResultSuccess(createTestTotpRecoveryCodesPayload())
    mockApi.disableTotpResult = appResultSuccess(undefined)
    mockApi.getRecoveryCodesResult = appResultSuccess(createTestTotpRecoveryCodesPayload())
    mockApi.regenerateRecoveryCodesResult = appResultSuccess(createTestTotpRecoveryCodesPayload())

    vi.spyOn(mockApi, 'setupTotp').mockImplementation(mockApi.setupTotp.bind(mockApi))
    vi.spyOn(mockApi, 'enableTotp').mockImplementation(mockApi.enableTotp.bind(mockApi))
    vi.spyOn(mockApi, 'disableTotp').mockImplementation(mockApi.disableTotp.bind(mockApi))
    vi.spyOn(mockApi, 'getRecoveryCodes').mockImplementation(mockApi.getRecoveryCodes.bind(mockApi))
    vi.spyOn(mockApi, 'regenerateRecoveryCodes').mockImplementation(mockApi.regenerateRecoveryCodes.bind(mockApi))

    mockStorage = new UserStorageMock({ initialUser: mockUser })
    vi.spyOn(mockStorage, 'updateCurrentUser').mockImplementation(mockStorage.updateCurrentUser.bind(mockStorage))

    repository = new OpenUserSecurityRepositoryImpl(mockApi, mockStorage)
  })

  it('delegates setupTotp and maps result', async () => {
    const result = await repository.setupTotp()
    expect(mockApi.setupTotp).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('enables TOTP and updates storage', async () => {
    const result = await repository.enableTotp('mfa1', '123456')
    expect(mockApi.enableTotp).toHaveBeenCalledWith('mfa1', '123456')
    expect(mockStorage.updateCurrentUser).toHaveBeenCalledWith(expect.objectContaining({ isTotpEnabled: true }))
    expect(isSuccess(result)).toBe(true)
  })

  it('disables TOTP and updates storage', async () => {
    const result = await repository.disableTotp()
    expect(mockApi.disableTotp).toHaveBeenCalled()
    expect(mockStorage.updateCurrentUser).toHaveBeenCalledWith(expect.objectContaining({ isTotpEnabled: false }))
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getRecoveryCodes and maps result', async () => {
    const result = await repository.getRecoveryCodes()
    expect(mockApi.getRecoveryCodes).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates regenerateRecoveryCodes and maps result', async () => {
    const result = await repository.regenerateRecoveryCodes()
    expect(mockApi.regenerateRecoveryCodes).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })
})
