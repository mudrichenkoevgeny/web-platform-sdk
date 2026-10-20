import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementAuthSettingsApi } from '@/network/api/auth/settings/fetch-management-auth-settings-api'
import { ManagementAuthSettingsRoutes, createTestManagementAuthSettingsPayload, createTestUpdateManagementAuthSettingsRequest } from '@mudrichenkoevgeny/shared-foundation'

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

    const result = await api.getManagementAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.GET_MANAGEMENT_AUTH_SETTINGS
    )
    expect(result).toEqual({ success: true, data: mockAuthSettingsPayload })
  })

  it('dispatches updateManagementAuthSettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = createTestUpdateManagementAuthSettingsRequest()
    const result = await api.updateManagementAuthSettings(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.UPDATE_MANAGEMENT_AUTH_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches resetManagementAuthSettings request', async () => {
    const mockAuthSettingsPayload = createTestManagementAuthSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthSettingsPayload)

    const result = await api.resetManagementAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.RESET_MANAGEMENT_AUTH_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: mockAuthSettingsPayload })
  })
})
