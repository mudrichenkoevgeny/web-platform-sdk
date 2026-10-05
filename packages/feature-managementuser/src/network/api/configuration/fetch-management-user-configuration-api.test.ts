import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserConfigurationApi } from '@/network/api/configuration/fetch-management-user-configuration-api'
import { ManagementUserConfigurationRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementUserConfigurationApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementUserConfigurationApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementUserConfigurationApi(mockHttpClient)
  })

  it('dispatches getManagementUserConfiguration request', async () => {
    const dummyPayload = { passwordPolicy: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getManagementUserConfiguration()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUserConfigurationRoutes.GET_CONFIGURATION
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
