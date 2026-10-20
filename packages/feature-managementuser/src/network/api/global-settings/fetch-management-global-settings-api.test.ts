import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementGlobalSettingsApi } from '@/network/api/global-settings/fetch-management-global-settings-api'
import { ManagementGlobalSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'

const createTestSettingsPayload = (appName = 'Platform') => ({
  app_name: appName,
  privacy_policy_url: null,
  terms_of_service_url: null,
  contact_support_email: null,
  min_supported_app_versions: {}
})

describe('FetchManagementGlobalSettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementGlobalSettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementGlobalSettingsApi(mockHttpClient)
  })

  it('dispatches getManagementGlobalSettings request', async () => {
    const mockSettingsPayload = createTestSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSettingsPayload)

    const result = await api.getManagementGlobalSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.GET_MANAGEMENT_GLOBAL_SETTINGS
    )
    expect(result).toEqual({ success: true, data: mockSettingsPayload })
  })

  it('dispatches updateManagementGlobalSettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = createTestSettingsPayload()
    const result = await api.updateManagementGlobalSettings(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.UPDATE_MANAGEMENT_GLOBAL_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches resetManagementGlobalSettings request', async () => {
    const mockSettingsPayload = createTestSettingsPayload('Default')
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSettingsPayload)

    const result = await api.resetManagementGlobalSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.RESET_MANAGEMENT_GLOBAL_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: mockSettingsPayload })
  })
})
