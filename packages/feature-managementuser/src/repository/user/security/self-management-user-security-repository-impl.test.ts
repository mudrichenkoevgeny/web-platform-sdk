import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_USER_ID, createTestTotpSetupPayload, createTestTotpRecoveryCodesPayload, createTestUserPrivate, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUserSecurityRepositoryImpl } from '@/repository/user/security/self-management-user-security-repository-impl'
import { SelfManagementUserSecurityApiMock } from '@/mock/network/api/user/security/self-management-user-security-api-mock'
import { UserStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementUserSecurityRepositoryImpl', () => {
  let mockApi: SelfManagementUserSecurityApiMock
  let mockUserStorage: UserStorageMock
  let repository: SelfManagementUserSecurityRepositoryImpl

  const mockTotpSetupPayload = createTestTotpSetupPayload()
  const mockTotpRecoveryCodesPayload = createTestTotpRecoveryCodesPayload()
  const mockUser = createTestUserPrivate({
    id: toUserIdOrThrow(TEST_USER_ID),
    isTotpEnabled: false
  })

  beforeEach(() => {
    mockApi = new SelfManagementUserSecurityApiMock()
    mockApi.setupTotpResult = appResultSuccess(mockTotpSetupPayload)
    mockApi.enableTotpResult = appResultSuccess(mockTotpRecoveryCodesPayload)
    mockApi.disableTotpResult = appResultSuccess(undefined)
    mockApi.getRecoveryCodesResult = appResultSuccess(mockTotpRecoveryCodesPayload)
    mockApi.regenerateRecoveryCodesResult = appResultSuccess(mockTotpRecoveryCodesPayload)

    vi.spyOn(mockApi, 'setupTotp').mockImplementation(mockApi.setupTotp.bind(mockApi))
    vi.spyOn(mockApi, 'enableTotp').mockImplementation(mockApi.enableTotp.bind(mockApi))
    vi.spyOn(mockApi, 'disableTotp').mockImplementation(mockApi.disableTotp.bind(mockApi))
    vi.spyOn(mockApi, 'getRecoveryCodes').mockImplementation(mockApi.getRecoveryCodes.bind(mockApi))
    vi.spyOn(mockApi, 'regenerateRecoveryCodes').mockImplementation(mockApi.regenerateRecoveryCodes.bind(mockApi))

    mockUserStorage = new UserStorageMock()
    mockUserStorage.updateCurrentUser(mockUser)
    vi.spyOn(mockUserStorage, 'updateCurrentUser').mockImplementation(mockUserStorage.updateCurrentUser.bind(mockUserStorage))

    repository = new SelfManagementUserSecurityRepositoryImpl(mockApi, mockUserStorage)
  })

  it('delegates setupTotp to API', async () => {
    const setupTotpResult = await repository.setupTotp()
    expect(mockApi.setupTotp).toHaveBeenCalled()
    expect(isSuccess(setupTotpResult)).toBe(true)
  })

  it('delegates enableTotp and updates TOTP status in storage', async () => {
    const enableTotpResult = await repository.enableTotp('mfaToken', '123456')
    expect(mockApi.enableTotp).toHaveBeenCalledWith('mfaToken', '123456')
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalledWith({
      ...mockUser,
      isTotpEnabled: true
    })
    expect(isSuccess(enableTotpResult)).toBe(true)
  })

  it('delegates disableTotp and updates TOTP status in storage', async () => {
    const disableTotpResult = await repository.disableTotp()
    expect(mockApi.disableTotp).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalledWith({
      ...mockUser,
      isTotpEnabled: false
    })
    expect(isSuccess(disableTotpResult)).toBe(true)
  })

  it('delegates getRecoveryCodes to API', async () => {
    const getRecoveryCodesResult = await repository.getRecoveryCodes()
    expect(mockApi.getRecoveryCodes).toHaveBeenCalled()
    expect(isSuccess(getRecoveryCodesResult)).toBe(true)
  })

  it('delegates regenerateRecoveryCodes to API', async () => {
    const regenerateRecoveryCodesResult = await repository.regenerateRecoveryCodes()
    expect(mockApi.regenerateRecoveryCodes).toHaveBeenCalled()
    expect(isSuccess(regenerateRecoveryCodesResult)).toBe(true)
  })
})
