import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionToken } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Obtains a new session token pair using a refresh token from the auth API.
 */
export interface RefreshTokenRepository {
  /**
   * Exchanges refreshToken for fresh access and refresh tokens.
   *
   * @param refreshToken - Opaque refresh credential
   * @returns SessionToken on success or error AppResult
   */
  refreshToken(refreshToken: string): Promise<AppResult<SessionToken, AppError>>
}
