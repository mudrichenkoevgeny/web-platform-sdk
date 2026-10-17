import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'

/** Access to the signed-in user snapshot and user management in self-management context. */
export interface SelfManagementUserRepository {
  /**
   * Observes changes to current cached user snapshot.
   *
   * @param listener - Callback function triggered on user change
   * @returns Unsubscribe cleanup function
   */
  observeCurrentUser(listener: (user: UserPrivate | null) => void): () => void

  /** Forces a network reload of current user details and updates local storage on success. */
  refreshCurrentUser(): Promise<AppResult<UserPrivate, AppError>>

  /** Clears local user storage and authentication tokens. */
  clearSession(): Promise<void>
}
