import { AppError, AppResult, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RefreshTokenRepository } from '@/repository/auth/refreshtoken/RefreshTokenRepository'
import { SessionToken } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Mock implementation of {@link RefreshTokenRepository}.
 */
export class RefreshTokenRepositoryMock implements RefreshTokenRepository {
  public refreshTokenResultProvider: (refreshToken: string) => Promise<AppResult<SessionToken, AppError>> = async () =>
    appResultFailure(CommonError.contractViolation(new Error('RefreshTokenRepositoryMock: result not provided')))

  public lastRefreshToken: string | null = null

  public async refreshToken(refreshToken: string): Promise<AppResult<SessionToken, AppError>> {
    this.lastRefreshToken = refreshToken
    return this.refreshTokenResultProvider(refreshToken)
  }
}
