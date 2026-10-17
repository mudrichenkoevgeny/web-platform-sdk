import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'

/** Current user details fetch. */
export interface SelfManagementUserApi {
  /**
   * Fetches the signed-in user.
   *
   * @returns Current user DTO from the shared contract, or a mapped failure
   */
  getUser(): Promise<AppResult<UserPrivatePayload, AppError>>
}
