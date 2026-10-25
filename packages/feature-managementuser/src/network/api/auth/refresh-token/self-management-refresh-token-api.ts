import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AccessTokenWithSessionId } from '@mudrichenkoevgeny/shared-foundation'

/** Management REST API client interface for refreshing self-management access tokens. */
export interface SelfManagementRefreshTokenApi {
  /**
   * Refreshes an expired staff access token.
   *
   * @param refreshToken - Active refresh token string
   * @returns AppResult containing new {@link AccessTokenWithSessionId} on success
   */
  refreshToken(refreshToken: string): Promise<AppResult<AccessTokenWithSessionId, AppError>>
}
