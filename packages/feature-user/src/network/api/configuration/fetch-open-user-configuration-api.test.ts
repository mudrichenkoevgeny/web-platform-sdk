import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenUserConfigurationRoutes, createTestApiErrorResponse, createTestOpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenUserConfigurationApi } from './fetch-open-user-configuration-api'

describe('FetchOpenUserConfigurationApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenUserConfigurationApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenUserConfigurationApi(mockHttpClient)
  })

  it('fetches open user configuration successfully', async () => {
    const mockPayload = createTestOpenUserConfigurationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getOpenUserConfiguration()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserConfigurationRoutes.GET_OPEN_USER_CONFIGURATION
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'CONFIG_ERROR', message: 'Error' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getOpenUserConfiguration()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('CONFIG_ERROR')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getOpenUserConfiguration()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
