import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementAuthSettingsApi } from '@/network/api/auth/settings/fetch-management-auth-settings-api'
import { ManagementAuthSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementAuthSettingsApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementAuthSettingsApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementAuthSettingsApi(mockHttpClient)
  })

  it('dispatches getManagementAuthSettings request', async () => {
    const dummyPayload = { availableAuthProviders: [] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getManagementAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.GET_MANAGEMENT_AUTH_SETTINGS
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches updateManagementAuthSettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { availableAuthProviders: [] } as any
    const result = await api.updateManagementAuthSettings(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.UPDATE_MANAGEMENT_AUTH_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches resetManagementAuthSettings request', async () => {
    const dummyPayload = { availableAuthProviders: [] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.resetManagementAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuthSettingsRoutes.RESET_MANAGEMENT_AUTH_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
