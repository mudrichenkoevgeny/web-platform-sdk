import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementAuthSettingsApi } from '@/network/api/auth/settings/fetch-management-auth-settings-api'
import { ManagementAuthSettingsRoutes, createTestApiErrorResponse, createTestManagementAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementAuthSettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementAuthSettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementAuthSettingsApi(mockHttpClient)
  })

  it('dispatches getManagementAuthSettings request', async () => {
    const mockAuthSettingsPayload = createTestManagementAuthSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthSettingsPayload)

    const authSettingsResult = await api.getManagementAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.GET_MANAGEMENT_AUTH_SETTINGS
    )
    expect(isSuccess(authSettingsResult)).toBe(true)
  })

  it('dispatches updateManagementAuthSettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const updateSettingsRequest = createTestManagementAuthSettingsPayload()
    const updateSettingsResult = await api.updateManagementAuthSettings(updateSettingsRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.UPDATE_MANAGEMENT_AUTH_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(updateSettingsRequest) })
    )
    expect(isSuccess(updateSettingsResult)).toBe(true)
  })

  it('dispatches resetManagementAuthSettings request', async () => {
    const mockAuthSettingsPayload = createTestManagementAuthSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthSettingsPayload)

    const resetSettingsResult = await api.resetManagementAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.RESET_MANAGEMENT_AUTH_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(resetSettingsResult)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'FORBIDDEN', message: 'Forbidden' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getManagementAuthSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('FORBIDDEN')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getManagementAuthSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
