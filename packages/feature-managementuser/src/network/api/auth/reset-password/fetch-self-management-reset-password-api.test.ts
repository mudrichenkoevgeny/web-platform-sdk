import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementResetPasswordApi } from '@/network/api/auth/reset-password/fetch-self-management-reset-password-api'
import {
  SelfManagementResetPasswordRoutes,
  TEST_EMAIL,
  TEST_IDENTIFIER_ID,
  createTestUserIdentifierPrivatePayload,
  toUserIdentifierIdOrThrow,
  createTestOtpConfirmationPayload,
  createTestApiErrorResponse
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementResetPasswordApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementResetPasswordApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementResetPasswordApi(mockHttpClient)
  })

  it('dispatches resetPassword request', async () => {
    const mockUserIdentifierPayload = createTestUserIdentifierPrivatePayload({
      id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserIdentifierPayload)

    const request = { email: TEST_EMAIL, new_password: 'new_secret', confirmation_code: '123456' }
    const result = await api.resetPassword(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementResetPasswordRoutes.RESET_PASSWORD,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches sendResetPasswordConfirmationToEmail request', async () => {
    const mockOtpConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpConfirmationPayload)

    const request = { email: 'admin@example.com' }
    const result = await api.sendResetPasswordConfirmationToEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementResetPasswordRoutes.SEND_RESET_PASSWORD_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'INVALID_CONFIRMATION_CODE', message: 'Wrong code' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.resetPassword({ email: TEST_EMAIL, new_password: 'pass', confirmation_code: 'wrong' })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('INVALID_CONFIRMATION_CODE')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.sendResetPasswordConfirmationToEmail({ email: TEST_EMAIL })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
