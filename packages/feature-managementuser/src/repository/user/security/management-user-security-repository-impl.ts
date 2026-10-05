import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserSecurityApi } from '@/network/api/user/security/management-user-security-api'
import type { ManagementUserSecurityRepository } from '@/repository/user/security/management-user-security-repository'

/**
 * Implementation of {@link ManagementUserSecurityRepository}.
 */
export class ManagementUserSecurityRepositoryImpl implements ManagementUserSecurityRepository {
  /**
   * Constructs a new {@link ManagementUserSecurityRepositoryImpl}.
   *
   * @param managementUserSecurityApi - Administrative HTTP endpoints for user security operations
   */
  public constructor(private readonly managementUserSecurityApi: ManagementUserSecurityApi) {}

  public async disableTotp(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.managementUserSecurityApi.disableTotp(userId)
  }
}
