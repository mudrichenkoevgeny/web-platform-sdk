import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfManagementUnlockRepositoryImpl } from '@/repository/auth/unlock/self-management-unlock-repository-impl'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'
import type { ConfirmationRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementUnlockRepositoryImpl', () => {
  let mockApi: SelfManagementUnlockApi
  let mockConfirmationRepo: ConfirmationRepository
  let repository: SelfManagementUnlockRepositoryImpl

  beforeEach(() => {
    mockApi = {
      sendUnlockEmailConfirmation: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 })),
      unlockByEmail: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      sendUnlockPhoneConfirmation: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 })),
      unlockByPhone: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      unlockByExternalAuthProvider: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as SelfManagementUnlockApi

    mockConfirmationRepo = {
      executeWithTimer: vi.fn().mockImplementation((_type, _identifier, action) => action()),
      getRemainingDelay: vi.fn().mockReturnValue(0)
    } as unknown as ConfirmationRepository

    repository = new SelfManagementUnlockRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates sendUnlockEmailConfirmation with timer', async () => {
    const result = await repository.sendUnlockEmailConfirmation('admin@example.com')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining email unlock cooldown delay', () => {
    expect(repository.getRemainingUnlockEmailConfirmationDelayInSeconds('admin@example.com')).toBe(0)
  })

  it('delegates unlockByEmail request', async () => {
    const result = await repository.unlockByEmail('admin@example.com', '123456')
    expect(mockApi.unlockByEmail).toHaveBeenCalledWith({ email: 'admin@example.com', confirmation_code: '123456' })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendUnlockPhoneConfirmation with timer', async () => {
    const result = await repository.sendUnlockPhoneConfirmation('+1234567890')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining phone unlock cooldown delay', () => {
    expect(repository.getRemainingUnlockPhoneConfirmationDelayInSeconds('+1234567890')).toBe(0)
  })

  it('delegates unlockByPhone request', async () => {
    const result = await repository.unlockByPhone('+1234567890', '123456')
    expect(mockApi.unlockByPhone).toHaveBeenCalledWith({ phone_number: '+1234567890', confirmation_code: '123456' })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates unlockByExternalAuthProvider request', async () => {
    const result = await repository.unlockByExternalAuthProvider('GOOGLE', 'token_xyz')
    expect(mockApi.unlockByExternalAuthProvider).toHaveBeenCalledWith({
      auth_provider: 'GOOGLE',
      external_provider_token: 'token_xyz'
    })
    expect(isSuccess(result)).toBe(true)
  })
})
