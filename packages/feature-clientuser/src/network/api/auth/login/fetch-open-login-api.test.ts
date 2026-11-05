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
  OpenLoginRoutes,
  TEST_EMAIL,
  TEST_PHONE,
  UserAuthProvider,
  createTestApiErrorResponse,
  createTestAuthDataPayload,
  createTestOtpConfirmationPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenLoginApi } from './fetch-open-login-api'

describe('FetchOpenLoginApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenLoginApi

  const mockAuthDataPayload = createTestAuthDataPayload()

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenLoginApi(mockHttpClient)
  })

  it('dispatches loginByEmail request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByEmail(TEST_EMAIL, 'secret123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: TEST_EMAIL, password: 'secret123' })
      })
    )
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockAuthDataPayload)
    }
  })

  it('dispatches loginByPhone request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByPhone(TEST_PHONE, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE, confirmation_code: '123456' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches loginByExternalAuthProvider request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const externalRequest = {
      auth_provider: UserAuthProvider.GOOGLE,
      external_provider_token: 'google-token-123'
    }
    const result = await api.loginByExternalAuthProvider(externalRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_EXTERNAL_AUTH_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(externalRequest)
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches loginByTotp request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByTotp('mfa-123', '654321')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_TOTP,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa-123', totp_code: '654321' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches loginByTotpRecoveryCode request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByTotpRecoveryCode('mfa-123', 'rec-code-123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa-123', totp_code: 'rec-code-123' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches sendLoginConfirmationToPhone request', async () => {
    const mockOtpPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpPayload)

    const result = await api.sendLoginConfirmationToPhone(TEST_PHONE)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.SEND_LOGIN_CONFIRMATION_TO_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'INVALID_CREDENTIALS', message: 'Bad password' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.loginByEmail(TEST_EMAIL, 'wrong')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('INVALID_CREDENTIALS')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.loginByEmail(TEST_EMAIL, 'secret123')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
