import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-open-refresh-token-api'
import { OpenRefreshTokenRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenRefreshTokenApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchOpenRefreshTokenApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchOpenRefreshTokenApi(mockHttpClient)
  })

  it('dispatches refreshToken request', async () => {
    const dummyPayload = { accessToken: 'access', refreshToken: 'refresh' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { refreshToken: 'refresh_token_123' } as any
    const result = await api.refreshToken(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRefreshTokenRoutes.REFRESH_TOKEN,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
