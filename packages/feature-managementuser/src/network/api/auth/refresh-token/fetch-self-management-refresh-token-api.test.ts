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

    const request = { refreshToken: 'refresh_token_123' }
    const result = await api.refreshToken(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementRefreshTokenRoutes.REFRESH_TOKEN,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: mockSessionTokenPayload })
  })
})
