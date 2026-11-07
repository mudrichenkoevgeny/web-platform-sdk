import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { createTestSessionToken, toAccessTokenOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedAuthStorage } from '../storage/auth/encrypted-auth-storage'
import { AuthHttpClientConfigPlugin } from '../network/httpclient/auth-http-client-config-plugin'

const server = setupServer(
  http.get('http://localhost:8080/protected-resource', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (authHeader === 'Bearer valid-token') {
      return HttpResponse.json({ status: 'ok' })
    }
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }),
  http.post('http://localhost:8080/open/v1/auth/refresh', () => {
    return HttpResponse.json({ message: 'Refresh token expired' }, { status: 401 })
  })
)

describe('Authentication Lifecycle Integration (Tokens + Storage + HttpClient + Session Clearing)', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('should attach token header and clear session when encountering 401 Unauthorized', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'http://localhost:8080' })
    const authStorage = new EncryptedAuthStorage(commonComponent.encryptedSettings)

    await authStorage.updateTokens(createTestSessionToken({
      accessToken: toAccessTokenOrThrow('invalid-token'),
      expiresAt: Date.now() + 3600000
    }))

    const onSessionClearedMock = vi.fn(async () => {
      await authStorage.clearTokens()
    })

    const authPlugin = new AuthHttpClientConfigPlugin({
      baseUrl: 'http://localhost:8080',
      authStorage,
      refreshTokenRoute: '/open/v1/auth/refresh',
      onSessionCleared: onSessionClearedMock
    })

    const customCommonComponent = createMockCommonComponent({
      baseUrl: 'http://localhost:8080',
      httpClientConfigPlugins: [authPlugin]
    })

    let caughtError: unknown = null
    try {
      await customCommonComponent.httpClient.request('/protected-resource')
    } catch (err) {
      caughtError = err
    }

    expect(caughtError).not.toBeNull()
    expect(onSessionClearedMock).toHaveBeenCalledTimes(1)

    const savedToken = await authStorage.getAccessTokenModel()
    expect(savedToken).toBeNull()
  })
})
