import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserConfigurationApi } from '@/network/api/configuration/fetch-management-user-configuration-api'
import {
  ManagementUserConfigurationRoutes,
  createTestApiErrorResponse,
  createTestManagementUserConfigurationPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementUserConfigurationApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementUserConfigurationApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementUserConfigurationApi(mockHttpClient)
  })

  it('dispatches getOpenUserConfiguration request', async () => {
    const mockConfigurationPayload = createTestManagementUserConfigurationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockConfigurationPayload)

    const result = await api.getOpenUserConfiguration()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUserConfigurationRoutes.GET_OPEN_USER_CONFIGURATION
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches getManagementUserConfiguration request', async () => {
    const mockConfigurationPayload = createTestManagementUserConfigurationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockConfigurationPayload)

    const result = await api.getManagementUserConfiguration()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUserConfigurationRoutes.GET_MANAGEMENT_USER_CONFIGURATION
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'UNAUTHORIZED', message: 'Unauthorized' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getManagementUserConfiguration()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('UNAUTHORIZED')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getManagementUserConfiguration()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
