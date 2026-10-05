import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenAuthSettingsApi } from '@/network/api/auth/settings/fetch-open-auth-settings-api'
import { OpenAuthSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenAuthSettingsApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchOpenAuthSettingsApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchOpenAuthSettingsApi(mockHttpClient)
  })

  it('dispatches getAuthSettings request', async () => {
    const dummyPayload = { availableAuthProviders: [] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getAuthSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenAuthSettingsRoutes.GET_OPEN_AUTH_SETTINGS
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })
})
