import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementStorageSettingsRoutes, createTestApiErrorResponse, createTestManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchManagementStorageSettingsApi } from './fetch-management-storage-settings-api'

describe('FetchManagementStorageSettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementStorageSettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementStorageSettingsApi(mockHttpClient)
  })

  it('fetches management storage settings successfully', async () => {
    const mockPayload = createTestManagementStorageSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementStorageSettingsRoutes.GET_MANAGEMENT_STORAGE_SETTINGS
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'STORAGE_SETTINGS_ERROR', message: 'Error' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('STORAGE_SETTINGS_ERROR')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
