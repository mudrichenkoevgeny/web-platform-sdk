import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { RefreshTokenPayload, SessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { RefreshTokenApi } from '@/network/api/auth/refresh-token/refresh-token-api'
/**
 * Mock implementation of {@link RefreshTokenApi}.
 */
export class RefreshTokenApiMock implements RefreshTokenApi {
  public refreshTokenResult: AppResult<SessionTokenPayload, AppError> = appResultFailure(CommonError.unknown())
  public lastRefreshTokenRequest: RefreshTokenPayload | null = null

  /**
   * Mocks token refresh API call.
   */
  public async refreshToken(request: RefreshTokenPayload): Promise<AppResult<SessionTokenPayload, AppError>> {
    this.lastRefreshTokenRequest = request
    return this.refreshTokenResult
  }
}
