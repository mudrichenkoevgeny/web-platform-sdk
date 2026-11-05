import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSecuritySettingsApi } from '@/network/api/security/settings/fetch-management-security-settings-api'
import { ManagementSecuritySettingsRoutes, createTestApiErrorResponse, createTestManagementSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementSecuritySettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementSecuritySettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementSecuritySettingsApi(mockHttpClient)
  })

  it('dispatches getManagementSecuritySettings request', async () => {
    const mockSecuritySettingsPayload = createTestManagementSecuritySettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSecuritySettingsPayload)

    const result = await api.getManagementSecuritySettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.GET_MANAGEMENT_SECURITY_SETTINGS
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches updateManagementSecuritySettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const updateRequest = createTestManagementSecuritySettingsPayload()
    const result = await api.updateManagementSecuritySettings(updateRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.UPDATE_MANAGEMENT_SECURITY_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(updateRequest) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches resetManagementSecuritySettings request', async () => {
    const mockSecuritySettingsPayload = createTestManagementSecuritySettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSecuritySettingsPayload)

    const result = await api.resetManagementSecuritySettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.RESET_MANAGEMENT_SECURITY_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'FORBIDDEN', message: 'Forbidden' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getManagementSecuritySettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('FORBIDDEN')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getManagementSecuritySettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
