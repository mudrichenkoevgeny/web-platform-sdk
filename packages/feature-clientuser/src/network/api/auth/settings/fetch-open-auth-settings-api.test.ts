import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenAuthSettingsRoutes, createTestApiErrorResponse, createTestOpenAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenAuthSettingsApi } from './fetch-open-auth-settings-api'

describe('FetchOpenAuthSettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenAuthSettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenAuthSettingsApi(mockHttpClient)
  })

  it('dispatches getOpenAuthSettings request', async () => {
    const mockPayload = createTestOpenAuthSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getOpenAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenAuthSettingsRoutes.GET_OPEN_AUTH_SETTINGS
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'AUTH_SETTINGS_ERROR', message: 'Error' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getOpenAuthSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('AUTH_SETTINGS_ERROR')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getOpenAuthSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
