import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, TEST_PHONE, createTestOtpConfirmationPayload, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUnlockRepositoryImpl } from '@/repository/auth/unlock/open-unlock-repository-impl'
import { OpenUnlockApiMock } from '@/mock/network/api/auth/unlock/open-unlock-api-mock'
import { ConfirmationRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenUnlockRepositoryImpl', () => {
  let mockApi: OpenUnlockApiMock
  let mockConfirmationRepo: ConfirmationRepositoryMock
  let repository: OpenUnlockRepositoryImpl

  beforeEach(() => {
    mockApi = new OpenUnlockApiMock()
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

    repository = new OpenUnlockRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates sendUnlockEmailConfirmation with timer', async () => {
    const result = await repository.sendUnlockEmailConfirmation(TEST_EMAIL)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining email unlock cooldown delay', () => {
    expect(repository.getRemainingUnlockEmailConfirmationDelayInSeconds(TEST_EMAIL)).toBe(0)
  })

  it('delegates unlockByEmail request', async () => {
    const result = await repository.unlockByEmail(TEST_EMAIL, '123456')
    expect(mockApi.unlockByEmail).toHaveBeenCalledWith(TEST_EMAIL, '123456')
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
    const result = await repository.unlockByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token_xyz')
    expect(mockApi.unlockByExternalAuthProvider).toHaveBeenCalledWith(UserAuthProvider.GOOGLE, 'token_xyz')
    expect(isSuccess(result)).toBe(true)
  })
})
