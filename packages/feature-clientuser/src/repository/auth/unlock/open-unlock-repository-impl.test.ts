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

    vi.spyOn(mockApi, 'sendUnlockEmailConfirmation')
    vi.spyOn(mockApi, 'unlockByEmail')
    vi.spyOn(mockApi, 'sendUnlockPhoneConfirmation')
    vi.spyOn(mockApi, 'unlockByPhone')
    vi.spyOn(mockApi, 'unlockByExternalAuthProvider')

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer')

    repository = new OpenUnlockRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates sendUnlockEmailConfirmation with timer', async () => {
    const emailConfirmationResult = await repository.sendUnlockEmailConfirmation(TEST_EMAIL)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(emailConfirmationResult)).toBe(true)
  })

  it('queries remaining email unlock cooldown delay', () => {
    expect(repository.getRemainingUnlockEmailConfirmationDelayInSeconds(TEST_EMAIL)).toBe(0)
  })

  it('delegates unlockByEmail request', async () => {
    const unlockByEmailResult = await repository.unlockByEmail(TEST_EMAIL, '123456')
    expect(mockApi.unlockByEmail).toHaveBeenCalledWith(TEST_EMAIL, '123456')
    expect(isSuccess(unlockByEmailResult)).toBe(true)
  })

  it('delegates sendUnlockPhoneConfirmation with timer', async () => {
    const phoneConfirmationResult = await repository.sendUnlockPhoneConfirmation(TEST_PHONE)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(phoneConfirmationResult)).toBe(true)
  })

  it('queries remaining phone unlock cooldown delay', () => {
    expect(repository.getRemainingUnlockPhoneConfirmationDelayInSeconds(TEST_PHONE)).toBe(0)
  })

  it('delegates unlockByPhone request', async () => {
    const unlockByPhoneResult = await repository.unlockByPhone(TEST_PHONE, '123456')
    expect(mockApi.unlockByPhone).toHaveBeenCalledWith(TEST_PHONE, '123456')
    expect(isSuccess(unlockByPhoneResult)).toBe(true)
  })

  it('delegates unlockByExternalAuthProvider request', async () => {
    const unlockByProviderResult = await repository.unlockByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token_xyz')
    expect(mockApi.unlockByExternalAuthProvider).toHaveBeenCalledWith(UserAuthProvider.GOOGLE, 'token_xyz')
    expect(isSuccess(unlockByProviderResult)).toBe(true)
  })
})
