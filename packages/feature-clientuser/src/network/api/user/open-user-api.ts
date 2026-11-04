import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import type { UpdateUserParams } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Current user details fetch and account deletion. */
export interface OpenUserApi {
  /**
   * Fetches the signed-in user.
   *
   * @returns Current user DTO from the shared contract, or a mapped failure
   */
  getUser(): Promise<AppResult<UserPrivatePayload, AppError>>

  /**
   * Partially updates account details and profile fields of the currently authenticated user.
   *
   * @param params - Partial profile update domain parameters
   * @returns Updated current user DTO, or a mapped failure
   */
  selfUpdateUser(params: UpdateUserParams): Promise<AppResult<UserPrivatePayload, AppError>>

  /**
   * Permanently deletes the signed-in account on the server.
   *
   * @returns Current user DTO reflecting pending deletion state, or a mapped failure
   */
  scheduleUserDeletion(): Promise<AppResult<UserPrivatePayload, AppError>>

  /**
   * Cancels a scheduled account deletion and restores the user to an active state.
   *
   * @returns Current user DTO reflecting the restored account status, or a mapped failure
   */
  restoreUser(): Promise<AppResult<UserPrivatePayload, AppError>>
}
