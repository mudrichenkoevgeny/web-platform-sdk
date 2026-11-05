import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenResetPasswordRoutes, createTestApiErrorResponse, createTestUserIdentifierPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchResetPasswordApi } from './fetch-reset-password-api'

describe('FetchResetPasswordApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchResetPasswordApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchResetPasswordApi(mockHttpClient)
  })

  it('dispatches resetPassword request', async () => {
    const mockIdentifierPayload = createTestUserIdentifierPrivatePayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockIdentifierPayload)

    const result = await api.resetPassword({ email: 'user@example.com', new_password: 'new', confirmation_code: '123456' })

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenResetPasswordRoutes.RESET_EMAIL_PASSWORD,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'INVALID_CODE', message: 'Bad code' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.resetPassword({ email: 'user@example.com', new_password: 'new', confirmation_code: 'wrong' })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('INVALID_CODE')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.resetPassword({ email: 'user@example.com', new_password: 'new', confirmation_code: '123456' })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
