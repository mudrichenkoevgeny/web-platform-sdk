import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenUnlockRepositoryImpl } from '@/repository/auth/unlock/open-unlock-repository-impl'
import type { OpenUnlockApi } from '@/network/api/auth/unlock/open-unlock-api'
import type { ConfirmationRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenUnlockRepositoryImpl', () => {
  let mockApi: OpenUnlockApi
  let mockConfirmationRepo: ConfirmationRepository
  let repository: OpenUnlockRepositoryImpl

  beforeEach(() => {
    mockApi = {
      sendUnlockEmailConfirmation: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 })),
      unlockByEmail: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      sendUnlockPhoneConfirmation: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 })),
      unlockByPhone: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      unlockByExternalAuthProvider: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as OpenUnlockApi

    mockConfirmationRepo = {
      executeWithTimer: vi.fn().mockImplementation((_type, _identifier, action) => action()),
      getRemainingDelay: vi.fn().mockReturnValue(0)
    } as unknown as ConfirmationRepository

    repository = new OpenUnlockRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates sendUnlockEmailConfirmation with timer', async () => {
    const result = await repository.sendUnlockEmailConfirmation('user@example.com')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining email unlock cooldown delay', () => {
    expect(repository.getRemainingUnlockEmailConfirmationDelayInSeconds('user@example.com')).toBe(0)
  })

  it('delegates unlockByEmail request', async () => {
    const result = await repository.unlockByEmail('user@example.com', '123456')
    expect(mockApi.unlockByEmail).toHaveBeenCalledWith({ email: 'user@example.com', confirmation_code: '123456' })
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
