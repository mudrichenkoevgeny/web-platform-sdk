import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import type { UpdateUserParams } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Current user details fetch and self profile update. */
export interface SelfManagementUserApi {
  /**
   * Fetches the signed-in user.
   *
   * @returns Current user DTO from the shared contract, or a mapped failure
   */
  getUser(): Promise<AppResult<UserPrivatePayload, AppError>>

  /**
   * Partially updates account details and profile fields of the current authenticated staff member.
   *
   * @param params - Partial profile update domain parameters
   * @returns Updated current user DTO, or a mapped failure
   */
  selfUpdateUser(params: UpdateUserParams): Promise<AppResult<UserPrivatePayload, AppError>>
}
