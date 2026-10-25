import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AccessTokenWithSessionId } from '@mudrichenkoevgeny/shared-foundation'

/** Open REST API client interface for refreshing access tokens. */
export interface OpenRefreshTokenApi {
  /**
   * Refreshes an expired access token using a valid refresh token.
   *
   * @param refreshToken - Active refresh token string
   * @returns AppResult containing new {@link AccessTokenWithSessionId} on success
   */
  refreshToken(refreshToken: string): Promise<AppResult<AccessTokenWithSessionId, AppError>>
}
