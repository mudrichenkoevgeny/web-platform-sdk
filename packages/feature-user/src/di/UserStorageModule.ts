import { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedUserStorage } from '../storage/user/EncryptedUserStorage'
import { UserStorage } from '../storage/user/UserStorage'

/**
 * Wiring container for encrypted user-scoped storage backed by {@link EncryptedSettings}.
 */
export class UserStorageModule {
  private _userStorage?: UserStorage

  /**
   * Constructs a new {@link UserStorageModule}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Lazily initialized instance of {@link UserStorage}.
   *
   * @returns Encrypted user storage instance
   */
  public get userStorage(): UserStorage {
    let instance = this._userStorage
    if (!instance) {
      instance = new EncryptedUserStorage(this.encryptedSettings)
      this._userStorage = instance
    }
    return instance
  }
}
