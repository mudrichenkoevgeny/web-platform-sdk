import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenRegistrationRoutes, createTestApiErrorResponse, createTestAuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchRegistrationApi } from './fetch-registration-api'

describe('FetchRegistrationApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchRegistrationApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchRegistrationApi(mockHttpClient)
  })

  it('dispatches registerByEmail request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.registerByEmail({ email: 'user@example.com', password: 'pass', confirmation_code: '123456' })

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRegistrationRoutes.REGISTRATION_BY_EMAIL,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'EMAIL_ALREADY_EXISTS', message: 'In use' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.registerByEmail({ email: 'user@example.com', password: 'pass', confirmation_code: '123456' })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('EMAIL_ALREADY_EXISTS')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.registerByEmail({ email: 'user@example.com', password: 'pass', confirmation_code: '123456' })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
