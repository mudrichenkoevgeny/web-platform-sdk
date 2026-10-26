import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUnlockRepositoryImpl } from '@/repository/auth/unlock/self-management-unlock-repository-impl'
import { SelfManagementUnlockApiMock } from '@/mock/network/api/auth/unlock/self-management-unlock-api-mock'
import { ConfirmationRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementUnlockRepositoryImpl', () => {
  let mockApi: SelfManagementUnlockApiMock
  let mockConfirmationRepo: ConfirmationRepositoryMock
  let repository: SelfManagementUnlockRepositoryImpl

  beforeEach(() => {
    mockApi = new SelfManagementUnlockApiMock()
    mockApi.sendUnlockEmailConfirmationResult = appResultSuccess(createTestOtpConfirmationPayload())
    mockApi.unlockByEmailResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'sendUnlockEmailConfirmation')
    vi.spyOn(mockApi, 'unlockByEmail')

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer')

    repository = new SelfManagementUnlockRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates sendUnlockEmailConfirmation with timer', async () => {
    const emailConfirmationResult = await repository.sendUnlockEmailConfirmation('admin@example.com')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(emailConfirmationResult)).toBe(true)
  })

  it('queries remaining email unlock cooldown delay', () => {
    expect(repository.getRemainingUnlockEmailConfirmationDelayInSeconds('admin@example.com')).toBe(0)
  })

  it('delegates unlockByEmail request', async () => {
    const unlockByEmailResult = await repository.unlockByEmail('admin@example.com', '123456')
    expect(mockApi.unlockByEmail).toHaveBeenCalledWith('admin@example.com', '123456')
    expect(isSuccess(unlockByEmailResult)).toBe(true)
  })
})
