import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { AuthHttpClientConfigPlugin } from '@/network/httpclient/AuthHttpClientConfigPlugin'
import type { AuthStorage } from '@/storage/auth/AuthStorage'

describe('AuthHttpClientConfigPlugin', () => {
  let mockAuthStorage: AuthStorage
  let plugin: AuthHttpClientConfigPlugin
  const onSessionCleared = vi.fn()

  beforeEach(() => {
    mockAuthStorage = {
      getAccessTokenModel: vi.fn().mockResolvedValue({ value: 'bearer-token-123' }),
      getRefreshToken: vi.fn().mockResolvedValue({ value: 'refresh-token-123' }),
      updateTokens: vi.fn().mockResolvedValue(undefined),
      clearTokens: vi.fn().mockResolvedValue(undefined)
    } as unknown as AuthStorage

    onSessionCleared.mockReset()

    plugin = new AuthHttpClientConfigPlugin({
      baseUrl: 'https://api.example.com',
      authStorage: mockAuthStorage,
      refreshTokenRoute: '/auth/refresh',
      onSessionCleared
    })
  })

  it('attaches Bearer Authorization token to requests', async () => {
    const init = await plugin.onRequest('https://api.example.com/user', {})
    const headers = new Headers(init.headers)

    expect(headers.get('Authorization')).toBe('Bearer bearer-token-123')
  })

  it('refreshes token and retries request on 401', async () => {
    const original401Response = new Response(null, { status: 401 })
    const retry200Response = new Response(JSON.stringify({ success: true }), { status: 200 })

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('/auth/refresh')) {
        return new Response(
          JSON.stringify({
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
            expires_at: Date.now() + 3600000,
            token_type: 'Bearer',
            session_id: 'sess_1',
            identifier_id: 'ident_1'
          }),
          { status: 200 }
        )
      }
      return retry200Response
    })

    const result = await plugin.onResponse(
      original401Response,
      'https://api.example.com/data',
      {},
      mockFetch
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/auth/refresh',
      expect.objectContaining({ method: 'POST' })
    )
    expect(mockAuthStorage.updateTokens).toHaveBeenCalled()
    expect(result).toBe(retry200Response)
  })

  it('clears session when token refresh fails', async () => {
    const original401Response = new Response(null, { status: 401 })
    const mockFetch = vi.fn().mockResolvedValue(new Response(null, { status: 400 }))

    await plugin.onResponse(
      original401Response,
      'https://api.example.com/data',
      {},
      mockFetch
    )

    expect(onSessionCleared).toHaveBeenCalled()
  })

  it('clears session when session invalidating error code is received', async () => {
    const errorResponse = new Response(
      JSON.stringify({ code: UserErrorCodes.INVALID_SESSION }),
      { status: 400 }
    )

    const mockFetch = vi.fn().mockResolvedValue(new Response(null, { status: 400 }))

    await plugin.onResponse(
      errorResponse,
      'https://api.example.com/data',
      {},
      mockFetch
    )

    expect(onSessionCleared).toHaveBeenCalled()
  })
})
