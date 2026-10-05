import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-self-management-refresh-token-api'
import { SelfManagementRefreshTokenRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementRefreshTokenApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchSelfManagementRefreshTokenApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchSelfManagementRefreshTokenApi(mockHttpClient)
  })

  it('dispatches refreshToken request', async () => {
    const dummyPayload = { accessToken: 'access', refreshToken: 'refresh' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { refreshToken: 'refresh_token_123' } as any
    const result = await api.refreshToken(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementRefreshTokenRoutes.REFRESH_TOKEN,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
