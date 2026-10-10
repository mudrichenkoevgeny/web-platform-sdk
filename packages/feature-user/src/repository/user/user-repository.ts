import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Access to the signed-in user snapshot and profile management operations.
 */
export interface UserRepository {
  /**
   * Observes changes to current cached user snapshot.
   *
   * @param listener - Callback function triggered on profile change
   * @returns Unsubscribe cleanup function
   */
  observeCurrentUser(listener: (user: UserPrivate | null) => void): () => void

  /** Forces a network reload of current user profile and updates local storage on success. */
  refreshCurrentUser(): Promise<AppResult<UserPrivate, AppError>>

  /** Schedules current account for permanent deletion and updates local state. */
  scheduleUserDeletion(): Promise<AppResult<UserPrivate, AppError>>

  /** Cancels a pending account deletion request and updates local state. */
  restoreUser(): Promise<AppResult<UserPrivate, AppError>>

  /** Clears local user profile storage and authentication tokens. */
  clearSession(): Promise<void>
}
