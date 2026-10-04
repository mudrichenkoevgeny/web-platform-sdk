import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Current user profile fetch and account deletion. */
export interface OpenUserApi {
  /**
   * Fetches the profile for the signed-in user.
   *
   * @returns Current user DTO from the shared contract, or a mapped failure
   */
  getUser(): Promise<AppResult<UserDetailsPayload, AppError>>

  /**
   * Permanently deletes the signed-in account on the server.
   *
   * @returns Current user DTO reflecting pending deletion state, or a mapped failure
   */
  scheduleUserDeletion(): Promise<AppResult<UserDetailsPayload, AppError>>

  /**
   * Cancels a scheduled account deletion and restores the user to an active state.
   *
   * @returns Current user DTO reflecting the restored account status, or a mapped failure
   */
  restoreUser(): Promise<AppResult<UserDetailsPayload, AppError>>
}
