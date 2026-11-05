import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementGlobalSettingsApi } from '@/network/api/global-settings/fetch-management-global-settings-api'
import { ManagementGlobalSettingsRoutes, createTestApiErrorResponse, createTestManagementGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementGlobalSettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementGlobalSettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementGlobalSettingsApi(mockHttpClient)
  })

  it('dispatches getManagementGlobalSettings request', async () => {
    const mockGlobalSettingsPayload = createTestManagementGlobalSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockGlobalSettingsPayload)

    const result = await api.getManagementGlobalSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.GET_MANAGEMENT_GLOBAL_SETTINGS
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches updateManagementGlobalSettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const updateRequest = createTestManagementGlobalSettingsPayload()
    const result = await api.updateManagementGlobalSettings(updateRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.UPDATE_MANAGEMENT_GLOBAL_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(updateRequest) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'FORBIDDEN', message: 'Forbidden' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getManagementGlobalSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('FORBIDDEN')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getManagementGlobalSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
