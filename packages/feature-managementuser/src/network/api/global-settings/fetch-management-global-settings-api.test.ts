import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementGlobalSettingsApi } from '@/network/api/globalsettings/FetchManagementGlobalSettingsApi'
import { ManagementGlobalSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementGlobalSettingsApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementGlobalSettingsApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementGlobalSettingsApi(mockHttpClient)
  })

  it('dispatches getManagementGlobalSettings request', async () => {
    const dummyPayload = { appName: 'Platform' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getManagementGlobalSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.GET_MANAGEMENT_GLOBAL_SETTINGS
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches updateManagementGlobalSettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { appName: 'Platform' } as any
    const result = await api.updateManagementGlobalSettings(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.UPDATE_MANAGEMENT_GLOBAL_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })

  it('dispatches resetManagementGlobalSettings request', async () => {
    const dummyPayload = { appName: 'Default' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.resetManagementGlobalSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementGlobalSettingsRoutes.RESET_MANAGEMENT_GLOBAL_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })
})
