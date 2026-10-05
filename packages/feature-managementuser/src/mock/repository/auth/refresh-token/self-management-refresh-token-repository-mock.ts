import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SessionToken } from '@mudrichenkoevgeny/shared-foundation'
import type { RefreshTokenRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Mock implementation of {@link RefreshTokenRepository} for self management. */
export class SelfManagementRefreshTokenRepositoryMock implements RefreshTokenRepository {
  public resultProvider: (refreshToken: string) => Promise<AppResult<SessionToken, AppError>> = async () =>
    appResultFailure(
      CommonError.contractViolation(
        'RefreshTokenRepositoryMock: result not provided'
      )
    )

  public async refreshToken(refreshToken: string): Promise<AppResult<SessionToken, AppError>> {
    return this.resultProvider(refreshToken)
  }
}
