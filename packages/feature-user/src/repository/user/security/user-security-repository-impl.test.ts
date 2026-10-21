import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, createTestTotpSetupPayload, createTestTotpRecoveryCodesPayload, TEST_USER_ID, toUserIdOrThrow, toUserPrivate, type UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityRepositoryImpl } from '@/repository/user/security/user-security-repository-impl'
import { UserSecurityApiMock } from '@/mock/network/api/user/security/user-security-api-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'

describe('UserSecurityRepositoryImpl', () => {
  let mockApi: UserSecurityApiMock
  let mockStorage: UserStorageMock
  let repository: UserSecurityRepositoryImpl

  const mockUser: UserPrivate = toUserPrivate(createTestUserPrivatePayload({
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

    vi.spyOn(mockApi, 'setupTotp')
    vi.spyOn(mockApi, 'enableTotp')
    vi.spyOn(mockApi, 'disableTotp')
    vi.spyOn(mockApi, 'getRecoveryCodes')
    vi.spyOn(mockApi, 'regenerateRecoveryCodes')

    mockStorage = new UserStorageMock({ initialUser: mockUser })
    vi.spyOn(mockStorage, 'updateCurrentUser')

    repository = new UserSecurityRepositoryImpl(mockApi, mockStorage)
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
