import type { AccessTokenProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierId, UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import type { AccessToken, RefreshToken, SessionToken } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Persists session tokens for the user feature.
 */
export interface AuthStorage extends AccessTokenProvider {
  /**
   * Retrieves parsed access token domain model, or null if absent or expired.
   *
   * @returns Parsed access token or null
   */
  getAccessTokenModel(): Promise<AccessToken | null>

  /**
   * Retrieves parsed refresh token domain model, or null if absent.
   *
   * @returns Parsed refresh token or null
   */
  getRefreshToken(): Promise<RefreshToken | null>

  /**
   * Retrieves access token expiry timestamp in epoch milliseconds.
   *
   * @returns Expiry epoch milliseconds
   */
  getExpiresAt(): Promise<number>

  /**
   * Retrieves current active session ID, or null if absent.
   *
   * @returns Session ID or null
   */
  getSessionId(): Promise<UserSessionId | null>

  /**
   * Retrieves credential identifier ID used to authorize this session, or null if absent.
   *
   * @returns Identifier ID or null
   */
  getIdentifierId(): Promise<UserIdentifierId | null>

  /**
   * Persists a new session token set after login or token refresh.
   *
   * @param sessionToken - New session token containing access and refresh tokens
   */
  updateTokens(sessionToken: SessionToken): Promise<void>

  /**
   * Removes tokens from storage upon logout or session invalidation.
   */
  clearTokens(): Promise<void>
}
