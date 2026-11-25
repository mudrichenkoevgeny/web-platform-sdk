import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Observer listener signature for current user changes.
 */
export type UserChangeListener = (user: UserPrivate | null) => void

/**
 * Persists user-scoped data (current user snapshot) for offline and UI use.
 */
export interface UserStorage {
  /**
   * Retrieves cached user details snapshot, or null if unstored.
   *
   * @returns UserPrivate or null
   */
  getCurrentUser(): Promise<UserPrivate | null>

  /**
   * Observes changes to current user snapshot.
   *
   * @param listener - Callback function triggered on user update
   * @returns Unsubscribe function
   */
  observeCurrentUser(listener: UserChangeListener): () => void

  /**
   * Replaces cached active user snapshot.
   *
   * @param currentUser - New user details to persist
   */
  updateCurrentUser(currentUser: UserPrivate): Promise<void>

  /**
   * Drops all user-scoped cached entries managed by this storage.
   */
  clear(): Promise<void>
}
