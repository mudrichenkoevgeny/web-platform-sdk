import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SessionToken } from '@mudrichenkoevgeny/shared-foundation'
import { toSessionToken } from '@mudrichenkoevgeny/shared-foundation'
import { RefreshTokenApi, RefreshTokenRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/**
 * Implements {@link RefreshTokenRepository} by delegating to {@link RefreshTokenApi}.
 */
export class SelfManagementRefreshTokenRepositoryImpl implements RefreshTokenRepository {
  /**
   * Constructs a new {@link SelfManagementRefreshTokenRepositoryImpl}.
   *
   * @param refreshTokenApi - HTTP endpoint for token refresh
   */
  public constructor(private readonly refreshTokenApi: RefreshTokenApi) {}

  public async refreshToken(refreshToken: string): Promise<AppResult<SessionToken, AppError>> {
    const result = await this.refreshTokenApi.refreshToken({ refresh_token: refreshToken })
    return mapSuccess(result, (sessionTokenResponse) => toSessionToken(sessionTokenResponse))
  }
}
