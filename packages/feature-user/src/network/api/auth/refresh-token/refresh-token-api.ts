import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { RefreshTokenPayload, SessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Exchange refresh token for a new session token pair. */
export interface RefreshTokenApi {
  /**
   * Obtains a new access (and refresh) token pair from the current refresh token.
   *
   * @param request - Refresh token wrapper from the shared contract
   * @returns New session token material and expiry, or a mapped failure
   */
  refreshToken(request: RefreshTokenPayload): Promise<AppResult<SessionTokenPayload, AppError>>
}
