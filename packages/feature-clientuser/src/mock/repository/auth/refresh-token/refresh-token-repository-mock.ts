import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SessionToken } from '@mudrichenkoevgeny/shared-foundation'
import type { RefreshTokenRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export class RefreshTokenRepositoryMock implements RefreshTokenRepository {
  public refreshTokenResultProvider: (refreshToken: string) => Promise<AppResult<SessionToken, AppError>> = async () =>
    appResultFailure(CommonError.contractViolation(new Error('RefreshTokenRepositoryMock: result not provided')))

  public lastRefreshToken: string | null = null

  public async refreshToken(refreshToken: string): Promise<AppResult<SessionToken, AppError>> {
    this.lastRefreshToken = refreshToken
    return this.refreshTokenResultProvider(refreshToken)
  }
}
