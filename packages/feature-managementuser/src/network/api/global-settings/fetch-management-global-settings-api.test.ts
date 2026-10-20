import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementGlobalSettingsApi } from '@/network/api/global-settings/fetch-management-global-settings-api'
import { ManagementGlobalSettingsRoutes, createTestManagementGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

const createTestSettingsPayload = (appName = 'Platform') => ({
  ...createTestManagementGlobalSettingsPayload(),
  app_name: appName
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
    const mockGlobalSettingsPayload = createTestSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockGlobalSettingsPayload)

    const globalSettingsResult = await api.getManagementGlobalSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.GET_MANAGEMENT_GLOBAL_SETTINGS
    )
    expect(globalSettingsResult).toEqual({ success: true, data: mockGlobalSettingsPayload })
  })

  it('dispatches updateManagementGlobalSettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const updateGlobalSettingsRequest = createTestSettingsPayload()
    const updateGlobalSettingsResult = await api.updateManagementGlobalSettings(updateGlobalSettingsRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.UPDATE_MANAGEMENT_GLOBAL_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(updateGlobalSettingsRequest) })
    )
    expect(updateGlobalSettingsResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches resetManagementGlobalSettings request', async () => {
    const mockGlobalSettingsPayload = createTestSettingsPayload('Default')
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockGlobalSettingsPayload)

    const resetGlobalSettingsResult = await api.resetManagementGlobalSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.RESET_MANAGEMENT_GLOBAL_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(resetGlobalSettingsResult).toEqual({ success: true, data: mockGlobalSettingsPayload })
  })
})
