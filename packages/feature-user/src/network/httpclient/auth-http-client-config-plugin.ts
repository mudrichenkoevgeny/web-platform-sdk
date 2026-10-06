import { sessionTokenPayloadSchema, UserErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { HttpClientConfigPlugin } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { IS_PUBLIC_API_HEADER } from '@/network/auth/is-public-api'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import { toSessionToken } from '@mudrichenkoevgeny/shared-foundation'

const SESSION_INVALIDATING_ERROR_CODES = new Set<string>([
  UserErrorCodes.INVALID_ACCESS_TOKEN,
  UserErrorCodes.INVALID_REFRESH_TOKEN,
  UserErrorCodes.INVALID_SESSION,
  UserErrorCodes.USER_BANNED,
  UserErrorCodes.USER_LOCKED,
  UserErrorCodes.USER_SECURITY_HOLD
])

/**
 * Options for configuring {@link AuthHttpClientConfigPlugin}.
 */
export interface AuthHttpClientConfigOptions {
  readonly baseUrl: string
  readonly authStorage: AuthStorage
  readonly refreshTokenRoute: string
  readonly onSessionCleared?: (() => Promise<void> | void) | null
  readonly logger?: ((msg: string) => void) | null
}

/**
 * {@link HttpClientConfigPlugin} that installs bearer token attachment, token auto-refresh,
 * and session invalidation on unauthorized or security-blocked responses.
 */
export class AuthHttpClientConfigPlugin implements HttpClientConfigPlugin {
  private readonly baseUrl: string
  private readonly authStorage: AuthStorage
  private readonly refreshTokenRoute: string
  private readonly onSessionCleared?: (() => Promise<void> | void) | null
  private readonly logger?: ((msg: string) => void) | null

  /**
   * Constructs a new {@link AuthHttpClientConfigPlugin}.
   *
   * @param options - Auth plugin options
   */
  public constructor(options: AuthHttpClientConfigOptions) {
    this.baseUrl = options.baseUrl.endsWith('/') ? options.baseUrl.slice(0, -1) : options.baseUrl
    this.authStorage = options.authStorage
    this.refreshTokenRoute = options.refreshTokenRoute.startsWith('/')
      ? options.refreshTokenRoute
      : `/${options.refreshTokenRoute}`
    this.onSessionCleared = options.onSessionCleared
    this.logger = options.logger
  }

  /**
   * Intercepts outgoing requests to attach Bearer Authorization token if unskipped.
   *
   * @param url - Request target URL
   * @param init - Request options
   * @returns Modified request options
   */
  public async onRequest(url: string, init: RequestInit): Promise<RequestInit> {
    const headers = new Headers(init.headers)

    if (headers.get(IS_PUBLIC_API_HEADER) === 'true') {
      headers.delete(IS_PUBLIC_API_HEADER)
      return { ...init, headers }
    }

    if (url.includes(this.refreshTokenRoute)) {
      return { ...init, headers }
    }

    const token = await this.authStorage.getAccessTokenModel()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    } else {
      this.logger?.('Auth: Missing or expired token in storage')
    }

    return { ...init, headers }
  }

  /**
   * Intercepts responses to detect 401s or session-invalidating error codes,
   * performs token auto-refresh and retries the original request.
   *
   * @param response - Received HTTP response
   * @param url - Optional request target URL
   * @param init - Optional request options
   * @param fetchImpl - Optional fetch implementation function
   * @returns Original or retried HTTP response
   */
  public async onResponse(
    response: Response,
    url?: string,
    init?: RequestInit,
    fetchImpl?: typeof fetch
  ): Promise<Response> {
    const isRefreshRequest = url ? url.includes(this.refreshTokenRoute) : false

    if (isRefreshRequest && !response.ok) {
      this.logger?.('Auth: Refresh request failed. Clearing session...')
      await this.handleSessionInvalidated()
      return response
    }

    let isUnauthorized = response.status === 401

    if (!response.ok && !isUnauthorized) {
      try {
        const clone = response.clone()
        const json = await clone.json()
        if (json && typeof json.code === 'string' && SESSION_INVALIDATING_ERROR_CODES.has(json.code)) {
          this.logger?.(`Auth: Session invalidating error code received: ${json.code}`)
          isUnauthorized = true
        }
      } catch {
        // Response body not JSON or unreadable
      }
    }

    if (isUnauthorized && url && fetchImpl && !isRefreshRequest) {
      const refreshedToken = await this.tryRefreshTokens(fetchImpl)
      if (refreshedToken) {
        this.logger?.(`Auth: Token refresh successful. Retrying original request to ${url}`)
        const newHeaders = new Headers(init?.headers)
        newHeaders.set('Authorization', `Bearer ${refreshedToken}`)
        return fetchImpl(url, { ...init, headers: newHeaders })
      } else {
        await this.handleSessionInvalidated()
        return response
      }
    }

    if (isUnauthorized) {
      await this.handleSessionInvalidated()
    }

    return response
  }

  private async tryRefreshTokens(fetchImpl: typeof fetch): Promise<string | null> {
    const refreshToken = await this.authStorage.getRefreshToken()
    if (!refreshToken) {
      this.logger?.('Auth: Refresh token not found in storage')
      return null
    }

    const refreshUrl = `${this.baseUrl}${this.refreshTokenRoute}`
    this.logger?.(`Auth: Attempting token refresh via ${refreshUrl}`)

    try {
      const refreshResponse = await fetchImpl(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      })

      if (!refreshResponse.ok) {
        this.logger?.(`Auth: Token refresh HTTP error: ${refreshResponse.status}`)
        return null
      }

      const json = await refreshResponse.json()
      const validationResult = sessionTokenPayloadSchema.safeParse(json)
      if (!validationResult.success) {
        this.logger?.('Auth: Invalid session token response schema')
        return null
      }

      const sessionToken = toSessionToken(validationResult.data)
      await this.authStorage.updateTokens(sessionToken)
      return sessionToken.accessToken
    } catch (e: unknown) {
      this.logger?.(`Auth: Token refresh failed with exception: ${String(e)}`)
      return null
    }
  }

  private async handleSessionInvalidated(): Promise<void> {
    const accessToken = await this.authStorage.getAccessTokenModel()
    const refreshToken = await this.authStorage.getRefreshToken()
    if (!accessToken && !refreshToken) {
      return
    }

    if (this.onSessionCleared) {
      await this.onSessionCleared()
    } else {
      await this.authStorage.clearTokens()
    }
  }
}
