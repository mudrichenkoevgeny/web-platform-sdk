import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, createTestAuthDataPayload, createTestOtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenRegistrationRepositoryImpl } from '@/repository/auth/registration/open-registration-repository-impl'
import { OpenRegistrationApiMock } from '@/mock/network/api/auth/registration/open-registration-api-mock'
import { ConfirmationRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenRegistrationRepositoryImpl', () => {
  let mockApi: OpenRegistrationApiMock
  let mockConfirmationRepo: ConfirmationRepositoryMock
  let repository: OpenRegistrationRepositoryImpl

  const mockAuthPayload = createTestAuthDataPayload()

  beforeEach(() => {
    mockApi = new OpenRegistrationApiMock()
    mockApi.registerByEmailResult = appResultSuccess(mockAuthPayload)
    mockApi.sendRegistrationConfirmationToEmailResult = appResultSuccess(createTestOtpConfirmationPayload())

    vi.spyOn(mockApi, 'registerByEmail').mockImplementation(mockApi.registerByEmail.bind(mockApi))
    vi.spyOn(mockApi, 'sendRegistrationConfirmationToEmail').mockImplementation(mockApi.sendRegistrationConfirmationToEmail.bind(mockApi))

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer').mockImplementation(mockConfirmationRepo.executeWithTimer.bind(mockConfirmationRepo))

    repository = new OpenRegistrationRepositoryImpl(mockApi, mockConfirmationRepo)
  })

  it('delegates registerByEmail and maps response to AuthData', async () => {
    const result = await repository.registerByEmail(TEST_EMAIL, 'secret', '123456')
    expect(mockApi.registerByEmail).toHaveBeenCalledWith({
      email: TEST_EMAIL,
      password: 'secret',
      confirmation_code: '123456'
    })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendRegistrationConfirmationToEmail with timer', async () => {
    const result = await repository.sendRegistrationConfirmationToEmail(TEST_EMAIL)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining cooldown delay', () => {
    const delay = repository.getRemainingRegistrationConfirmationDelayInSeconds(TEST_EMAIL)
    expect(delay).toBe(0)
  })
})
