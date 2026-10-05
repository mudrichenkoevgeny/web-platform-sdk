import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUserApi } from '@/network/api/user/FetchSelfManagementUserApi'
import { SelfManagementUserRoutes } from '@mudrichenkoevgeny/shared-foundation'

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
    const dummyPayload = { id: 'usr_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserRoutes.GET_USER
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })
})
