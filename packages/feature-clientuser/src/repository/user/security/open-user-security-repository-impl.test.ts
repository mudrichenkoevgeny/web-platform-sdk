import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenUserSecurityRepositoryImpl } from '@/repository/user/security/open-user-security-repository-impl'
import type { UserSecurityApi, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenUserSecurityRepositoryImpl', () => {
  let mockApi: UserSecurityApi
  let mockStorage: UserStorage
  let repository: OpenUserSecurityRepositoryImpl

  const dummyUser = {
    id: 'usr_1',
    isTotpEnabled: false
  } as any

  beforeEach(() => {
    mockApi = {
      setupTotp: vi.fn().mockResolvedValue(appResultSuccess({ secret_key: 'secret', otp_auth_url: 'url', mfa_token: 'mfa1' })),
      enableTotp: vi.fn().mockResolvedValue(appResultSuccess({ codes: ['c1'] })),
      disableTotp: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      getRecoveryCodes: vi.fn().mockResolvedValue(appResultSuccess({ codes: ['c1'] })),
      regenerateRecoveryCodes: vi.fn().mockResolvedValue(appResultSuccess({ codes: ['c2'] }))
    } as unknown as UserSecurityApi

    mockStorage = {
      getCurrentUser: vi.fn().mockResolvedValue(dummyUser),
      updateCurrentUser: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    repository = new OpenUserSecurityRepositoryImpl(mockApi, mockStorage)
  })

  it('delegates setupTotp and maps result', async () => {
    const result = await repository.setupTotp()
    expect(mockApi.setupTotp).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('enables TOTP and updates storage', async () => {
    const result = await repository.enableTotp('mfa1', '123456')
    expect(mockApi.enableTotp).toHaveBeenCalledWith({ mfa_token: 'mfa1', totp_code: '123456' })
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
