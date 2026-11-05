import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-self-management-refresh-token-api'
import { SelfManagementRefreshTokenRoutes, createTestApiErrorResponse, createTestSessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementRefreshTokenApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementRefreshTokenApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementRefreshTokenApi(mockHttpClient)
  })

  it('dispatches refreshToken request', async () => {
    const mockSessionTokenPayload = createTestSessionTokenPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionTokenPayload)

    const refreshTokenRequest = { refresh_token: 'refresh_token_123' }
    const refreshTokenResult = await api.refreshToken(refreshTokenRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementRefreshTokenRoutes.REFRESH_TOKEN,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(refreshTokenRequest)
      })
    )
    expect(isSuccess(refreshTokenResult)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'INVALID_REFRESH_TOKEN', message: 'Token expired' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.refreshToken({ refresh_token: 'expired' })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('INVALID_REFRESH_TOKEN')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
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
