import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserConfigurationApi } from '@/network/api/configuration/fetch-management-user-configuration-api'
import {
  ManagementUserConfigurationRoutes,
  createTestManagementUserConfigurationPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementUserConfigurationApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementUserConfigurationApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementUserConfigurationApi(mockHttpClient)
  })

  it('dispatches getManagementUserConfiguration request', async () => {
    const mockConfigurationPayload = createTestManagementUserConfigurationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockConfigurationPayload)

    const result = await api.getManagementUserConfiguration()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUserConfigurationRoutes.GET_MANAGEMENT_USER_CONFIGURATION
    )
    expect(result).toEqual({ success: true, data: mockConfigurationPayload })
  })
})
