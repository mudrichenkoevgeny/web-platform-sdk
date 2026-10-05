import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Current user profile fetch. */
export interface SelfManagementUserApi {
  /**
   * Fetches the profile for the signed-in user.
   *
   * @returns Current user DTO from the shared contract, or a mapped failure
   */
  getUser(): Promise<AppResult<UserDetailsPayload, AppError>>
}
