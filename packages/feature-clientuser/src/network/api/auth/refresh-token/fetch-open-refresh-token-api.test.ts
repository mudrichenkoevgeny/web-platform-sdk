import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenRefreshTokenRoutes, createTestApiErrorResponse, createTestSessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenRefreshTokenApi } from './fetch-open-refresh-token-api'

describe('FetchOpenRefreshTokenApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenRefreshTokenApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenRefreshTokenApi(mockHttpClient)
  })

  it('dispatches refreshToken request', async () => {
    const mockSessionTokenPayload = createTestSessionTokenPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionTokenPayload)

    const result = await api.refreshToken({ refresh_token: 'valid-refresh-token' })

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRefreshTokenRoutes.REFRESH_TOKEN,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'INVALID_REFRESH_TOKEN', message: 'Expired' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.refreshToken({ refresh_token: 'expired' })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('INVALID_REFRESH_TOKEN')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.refreshToken({ refresh_token: 'token' })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
