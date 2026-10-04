import { EncryptedSettings } from '@/storage/EncryptedSettings'
import { getSettingsFactory } from '@/storage/WebCryptoSettings'

/**
 * Component container for initializing WebCrypto encrypted settings.
 */
export class EncryptedSettingsComponent {
  /** Encrypted key-value settings manager. */
  public readonly encryptedSettings: EncryptedSettings

  /**
   * Constructs a new {@link EncryptedSettingsComponent}.
   *
   * @param storage - Optional custom Storage implementation (defaults to window.localStorage)
   */
  public constructor(storage?: Storage) {
    this.encryptedSettings = getSettingsFactory(storage).create()
  }
}
