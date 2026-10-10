import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUserApi } from '@/network/api/user/fetch-self-management-user-api'
import { SelfManagementUserRoutes, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userPrivatePayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('FetchSelfManagementUserApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchSelfManagementUserApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchSelfManagementUserApi(mockHttpClient)
  })

  it('dispatches getUser request', async () => {
    const dummyPayload = userPrivatePayloadMock({ id: toUserIdOrThrow('usr_1') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserRoutes.GET_USER
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
