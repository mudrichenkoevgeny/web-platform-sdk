import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-open-refresh-token-api'
import { OpenRefreshTokenRoutes, createTestSessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenRefreshTokenApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenRefreshTokenApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenRefreshTokenApi(mockHttpClient)
  })

  it('dispatches refreshToken request', async () => {
    const mockSessionTokenPayload = createTestSessionTokenPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionTokenPayload)

    const request = { refreshToken: 'refresh_token_123' }
    const result = await api.refreshToken(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRefreshTokenRoutes.REFRESH_TOKEN,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: mockSessionTokenPayload })
  })
})
