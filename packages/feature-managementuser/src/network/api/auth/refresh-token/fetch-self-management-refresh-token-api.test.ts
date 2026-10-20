import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-self-management-refresh-token-api'
import { SelfManagementRefreshTokenRoutes, createTestSessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementRefreshTokenApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementRefreshTokenApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementRefreshTokenApi(mockHttpClient)
  })

  it('dispatches refreshToken request', async () => {
    const mockSessionTokenPayload = createTestSessionTokenPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionTokenPayload)

    const refreshTokenRequest = { refresh_token: 'refresh_token_123' }
    const refreshTokenResult = await api.refreshToken(refreshTokenRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementRefreshTokenRoutes.REFRESH_TOKEN,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(refreshTokenRequest)
      })
    )
    expect(refreshTokenResult).toEqual({ success: true, data: mockSessionTokenPayload })
  })
})
