import {
  toUserPrivate,
  toUserPrivatePayload,
  userPrivatePayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserChangeListener, UserStorage } from '@/storage/user/user-storage'

const KEY_CURRENT_USER = 'current_user'

/**
 * Storage implementation of {@link UserStorage} backed by {@link EncryptedSettings}.
 */
export class EncryptedUserStorage implements UserStorage {
  /**
   * Constructs a new {@link EncryptedUserStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Retrieves and deserializes the current cached user.
   * Does not mutate storage state if reading or validation fails.
   *
   * @returns Deserialized user details or null if unreadable or absent
   */
  public async getCurrentUser(): Promise<UserPrivate | null> {
    const rawData = await this.encryptedSettings.get(KEY_CURRENT_USER)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = userPrivatePayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        return null
      }
      return toUserPrivate(validationResult.data)
    } catch {
      return null
    }
  }

  /**
   * Observes updates to the cached current user.
   *
   * @param listener - Callback function triggered on user change
   * @returns Unsubscribe function
   */
  public observeCurrentUser(listener: UserChangeListener): () => void {
    void this.getCurrentUser()
      .then((user) => {
        listener(user)
      })
      .catch(() => {
        listener(null)
      })

    return this.encryptedSettings.observe(KEY_CURRENT_USER, () => {
      void (async () => {
        try {
          const user = await this.getCurrentUser()
          listener(user)
        } catch {
          listener(null)
        }
      })()
    })
  }

  /**
   * Serializes and persists active user details.
   *
   * @param currentUser - Active user details snapshot
   */
  public async updateCurrentUser(currentUser: UserPrivate): Promise<void> {
    const payload = toUserPrivatePayload(currentUser)
    await this.encryptedSettings.put(KEY_CURRENT_USER, JSON.stringify(payload))
  }

  /**
   * Clears all cached user data.
   */
  public async clear(): Promise<void> {
    await this.encryptedSettings.remove(KEY_CURRENT_USER)
  }
}
