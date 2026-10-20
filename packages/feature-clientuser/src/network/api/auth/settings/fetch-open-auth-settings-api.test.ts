import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenAuthSettingsApi } from '@/network/api/auth/settings/fetch-open-auth-settings-api'
import { OpenAuthSettingsRoutes, createTestAvailableAuthProvidersPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenAuthSettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenAuthSettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenAuthSettingsApi(mockHttpClient)
  })

  it('dispatches getAuthSettings request', async () => {
    const mockAuthSettingsPayload = createTestAvailableAuthProvidersPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthSettingsPayload)

    const result = await api.getAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenAuthSettingsRoutes.GET_OPEN_AUTH_SETTINGS
    )
    expect(result).toEqual({ success: true, data: mockAuthSettingsPayload })
  })
})
