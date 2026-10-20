import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, createTestTotpSetupPayload, createTestTotpRecoveryCodesPayload, toUserPrivate, type UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityRepositoryImpl } from '@/repository/user/security/user-security-repository-impl'
import { UserSecurityApiMock } from '@/mock/network/api/user/security/user-security-api-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'

describe('UserSecurityRepositoryImpl', () => {
  let mockApi: UserSecurityApiMock
  let mockStorage: UserStorageMock
  let repository: UserSecurityRepositoryImpl

  const mockUser: UserPrivate = toUserPrivate(createTestUserPrivatePayload())

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

    mockStorage = new UserStorageMock()
    mockStorage.emit(mockUser)
    vi.spyOn(mockStorage, 'updateCurrentUser').mockImplementation(mockStorage.updateCurrentUser.bind(mockStorage))

    repository = new UserSecurityRepositoryImpl(mockApi, mockStorage)
  })

  it('delegates setupTotp and maps result', async () => {
    const result = await repository.setupTotp()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data.secretKey).toBeDefined()
    }
  })

  it('enables TOTP and updates isTotpEnabled in storage', async () => {
    const result = await repository.enableTotp('mfa_1', '123456')

    expect(isSuccess(result)).toBe(true)
    expect(mockStorage.updateCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({ isTotpEnabled: true })
    )
  })

  it('disables TOTP and updates isTotpEnabled in storage', async () => {
    const result = await repository.disableTotp()

    expect(isSuccess(result)).toBe(true)
    expect(mockStorage.updateCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({ isTotpEnabled: false })
    )
  })
})
