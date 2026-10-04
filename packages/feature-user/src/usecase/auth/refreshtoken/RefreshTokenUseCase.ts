import { appResultFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { RefreshTokenRepository } from '@/repository/auth/refreshtoken/RefreshTokenRepository'
import { AuthStorage } from '@/storage/auth/AuthStorage'
import type { SessionToken } from '@mudrichenkoevgeny/shared-foundation'
import { UserError } from '@/error/model/UserError'
/**
 * Refreshes the session using the stored refresh token; updates {@link AuthStorage} when new tokens are issued.
 */
export class RefreshTokenUseCase {
  /**
   * Constructs a new {@link RefreshTokenUseCase}.
   *
   * @param refreshTokenRepository - Remote token refresh API
   * @param authStorage - Persistent token storage
   */
  public constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authStorage: AuthStorage
  ) {}

  /**
   * Triggers session token refresh.
   *
   * @returns SessionToken on success or AppError
   */
  public async execute(): Promise<AppResult<SessionToken, AppError>> {
    const refreshTokenModel = await this.authStorage.getRefreshToken()
    if (!refreshTokenModel) {
      return appResultFailure(UserError.invalidRefreshToken())
    }

    const result = await this.refreshTokenRepository.refreshToken(refreshTokenModel)
    if (isSuccess(result)) {
      await this.authStorage.updateTokens(result.data)
    }
    return result
  }
}
