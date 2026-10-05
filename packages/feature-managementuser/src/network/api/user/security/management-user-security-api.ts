import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'

/** Administrative security management operations for user accounts. */
export interface ManagementUserSecurityApi {
  /**
   * Administratively disables TOTP (2FA) for a specific user.
   *
   * @param userId - Unique identifier of the target user
   * @returns Void result or a mapped failure
   */
  disableTotp(userId: UserId): Promise<AppResult<void, AppError>>
}
