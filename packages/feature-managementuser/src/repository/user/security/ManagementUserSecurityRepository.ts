import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'

/** Administrative repository for managing security configurations and multifactor authentication overrides across all user accounts. */
export interface ManagementUserSecurityRepository {
  /**
   * Administratively disables TOTP (2FA) for a specific user.
   *
   * @param userId - Unique identifier of the target user
   * @returns Void result or a mapped failure
   */
  disableTotp(userId: UserId): Promise<AppResult<void, AppError>>
}
