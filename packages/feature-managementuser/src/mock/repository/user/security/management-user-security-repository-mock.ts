import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserSecurityRepository } from '@/repository/user/security/ManagementUserSecurityRepository'

/** Mock implementation of {@link ManagementUserSecurityRepository}. */
export class ManagementUserSecurityRepositoryMock implements ManagementUserSecurityRepository {
  public disableTotpResultProvider: (userId: UserId) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public lastUserId: UserId | null = null

  public async disableTotp(userId: UserId): Promise<AppResult<void, AppError>> {
    this.lastUserId = userId
    return this.disableTotpResultProvider(userId)
  }
}
