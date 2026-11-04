import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { createTestUserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { UserChangeListener, UserStorage } from '@/storage/user/user-storage'

/**
 * Configuration options for initializing {@link UserStorageMock}.
 */
export interface UserStorageMockConfig {
  initialUser?: UserPrivate | null
}

/**
 * In-memory {@link UserStorage} mock for tests and previews.
 */
export class UserStorageMock implements UserStorage {
  private currentUserSnapshot: UserPrivate | null
  private readonly userListeners = new Set<UserChangeListener>()

  public isCleared = false

  public constructor(config?: UserStorageMockConfig) {
    this.currentUserSnapshot = config?.initialUser ?? null
  }

  public async getCurrentUser(): Promise<UserPrivate | null> {
    return this.currentUserSnapshot
  }

  public observeCurrentUser(listener: UserChangeListener): () => void {
    this.userListeners.add(listener)
    listener(this.currentUserSnapshot)
    return () => {
      this.userListeners.delete(listener)
    }
  }

  public async updateCurrentUser(currentUser: UserPrivate): Promise<void> {
    this.currentUserSnapshot = currentUser
    this.notifyUserListeners()
  }

  public async clear(): Promise<void> {
    this.currentUserSnapshot = null
    this.isCleared = true
    this.notifyUserListeners()
  }

  private notifyUserListeners(): void {
    for (const listener of this.userListeners) {
      listener(this.currentUserSnapshot)
    }
  }
}

/**
 * Helper factory for Storybook previews and UI testing requiring a pre-populated {@link UserStorageMock}.
 *
 * @returns Pre-populated UserStorageMock instance filled with default shared foundation test data.
 */
export const createPopulatedUserStorageMock = (): UserStorageMock => {
  return new UserStorageMock({
    initialUser: createTestUserPrivate()
  })
}
