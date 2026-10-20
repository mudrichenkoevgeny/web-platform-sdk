import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUserApi } from '@/network/api/user/fetch-self-management-user-api'
import { createTestUserPrivatePayload, SelfManagementUserRoutes, TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementUserApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementUserApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementUserApi(mockHttpClient)
  })

  it('dispatches getUser request', async () => {
    const mockUserPayload = createTestUserPrivatePayload({ id: toUserIdOrThrow(TEST_USER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const result = await api.getUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserRoutes.GET_USER
    )
    expect(result).toEqual({ success: true, data: mockUserPayload })
  })
})
