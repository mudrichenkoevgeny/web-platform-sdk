import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  AccountLockoutType,
  toUserIdOrThrow,
  UserAccountStatus,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserSecurityRepositoryImpl } from '@/repository/user/security/UserSecurityRepositoryImpl'
import type { UserSecurityApi } from '@/network/api/user/security/UserSecurityApi'
import type { UserStorage } from '@/storage/user/UserStorage'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'

describe('UserSecurityRepositoryImpl', () => {
  let mockApi: UserSecurityApi
  let mockStorage: UserStorage
  let repository: UserSecurityRepositoryImpl

  const dummyUser: UserDetails = {
    id: toUserIdOrThrow('usr_1'),
    role: UserRole.CLIENT_USER,
    accountStatus: UserAccountStatus.ACTIVE,
    accountStatusOnRestore: null,
    authorityLevel: 1,
    permissionCodes: [],
    isTotpEnabled: false,
    lastLoginAt: null,
    lastActiveAt: null,
    createdAt: Date.now(),
    updatedAt: null,
    scheduledPermanentDeletionAt: null,
    accountLockoutType: AccountLockoutType.NONE,
    temporaryLockoutUntil: null
  }

  beforeEach(() => {
    mockApi = {
      setupTotp: vi.fn().mockResolvedValue(
        appResultSuccess({
          totp_secret_key: 'SECRET',
          totp_otp_auth_url: 'otpauth://',
          mfa_token: 'mfa_1'
        })
      ),
      enableTotp: vi.fn().mockResolvedValue(
        appResultSuccess({
          totp_recovery_codes: ['code1', 'code2']
        })
      ),
      disableTotp: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      getRecoveryCodes: vi.fn().mockResolvedValue(
        appResultSuccess({
          totp_recovery_codes: ['code1', 'code2']
        })
      ),
      regenerateRecoveryCodes: vi.fn().mockResolvedValue(
        appResultSuccess({
          totp_recovery_codes: ['code3', 'code4']
        })
      )
    } as unknown as UserSecurityApi

    mockStorage = {
      getCurrentUser: vi.fn().mockResolvedValue(dummyUser),
      updateCurrentUser: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    repository = new UserSecurityRepositoryImpl(mockApi, mockStorage)
  })

  it('delegates setupTotp and maps result', async () => {
    const result = await repository.setupTotp()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data.totpSecretKey).toBe('SECRET')
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
