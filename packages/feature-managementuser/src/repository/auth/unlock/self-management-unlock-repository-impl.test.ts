import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_PHONE, createTestOtpConfirmationPayload, AuthProvider } from '@mudrichenkoevgeny/shared-foundation'
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
    mockApi.sendUnlockPhoneConfirmationResult = appResultSuccess(createTestOtpConfirmationPayload())
    mockApi.unlockByPhoneResult = appResultSuccess(undefined)
    mockApi.unlockByExternalAuthProviderResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'sendUnlockEmailConfirmation').mockImplementation(mockApi.sendUnlockEmailConfirmation.bind(mockApi))
    vi.spyOn(mockApi, 'unlockByEmail').mockImplementation(mockApi.unlockByEmail.bind(mockApi))
    vi.spyOn(mockApi, 'sendUnlockPhoneConfirmation').mockImplementation(mockApi.sendUnlockPhoneConfirmation.bind(mockApi))
    vi.spyOn(mockApi, 'unlockByPhone').mockImplementation(mockApi.unlockByPhone.bind(mockApi))
    vi.spyOn(mockApi, 'unlockByExternalAuthProvider').mockImplementation(mockApi.unlockByExternalAuthProvider.bind(mockApi))

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer').mockImplementation(mockConfirmationRepo.executeWithTimer.bind(mockConfirmationRepo))

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
    expect(mockApi.unlockByEmail).toHaveBeenCalledWith('admin@example.com', '123456')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendUnlockPhoneConfirmation with timer', async () => {
    const result = await repository.sendUnlockPhoneConfirmation(TEST_PHONE)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining phone unlock cooldown delay', () => {
    expect(repository.getRemainingUnlockPhoneConfirmationDelayInSeconds(TEST_PHONE)).toBe(0)
  })

  it('delegates unlockByPhone request', async () => {
    const result = await repository.unlockByPhone(TEST_PHONE, '123456')
    expect(mockApi.unlockByPhone).toHaveBeenCalledWith(TEST_PHONE, '123456')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates unlockByExternalAuthProvider request', async () => {
    const result = await repository.unlockByExternalAuthProvider(AuthProvider.GOOGLE, 'token_xyz')
    expect(mockApi.unlockByExternalAuthProvider).toHaveBeenCalledWith(AuthProvider.GOOGLE, 'token_xyz')
    expect(isSuccess(result)).toBe(true)
  })
})
