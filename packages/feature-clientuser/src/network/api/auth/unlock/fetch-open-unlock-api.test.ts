import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ApiException,
  HttpClientMock,
  isFailure,
  isSuccess,
  ServerError,
  CommonErrorNoInternetConnection,
  CommonErrorNetwork
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  OpenUnlockRoutes,
  TEST_EMAIL,
  TEST_PHONE,
  UserAuthProvider,
  createTestApiErrorResponse,
  createTestOtpConfirmationPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenUnlockApi } from './fetch-open-unlock-api'

describe('FetchOpenUnlockApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenUnlockApi

  const mockOtpPayload = createTestOtpConfirmationPayload()

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenUnlockApi(mockHttpClient)
  })

  it('dispatches sendUnlockEmailConfirmation request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpPayload)

    const result = await api.sendUnlockEmailConfirmation(TEST_EMAIL)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: TEST_EMAIL }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches sendUnlockPhoneConfirmation request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpPayload)

    const result = await api.sendUnlockPhoneConfirmation(TEST_PHONE)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.SEND_UNLOCK_PHONE_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ phone_number: TEST_PHONE }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches unlockByEmail request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByEmail(TEST_EMAIL, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_EMAIL,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: TEST_EMAIL, confirmation_code: '123456' }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches unlockByPhone request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByPhone(TEST_PHONE, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_PHONE,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ phone_number: TEST_PHONE, confirmation_code: '123456' }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches unlockByExternalAuthProvider request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByExternalAuthProvider(UserAuthProvider.APPLE, 'apple-token-123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_EXTERNAL_PROVIDER,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ auth_provider: UserAuthProvider.APPLE, external_provider_token: 'apple-token-123' }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'INVALID_CODE', message: 'Bad code' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.unlockByEmail(TEST_EMAIL, 'wrong')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('INVALID_CODE')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.unlockByEmail(TEST_EMAIL, '123456')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
