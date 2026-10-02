import { EncryptedSettings } from './EncryptedSettings'

/**
 * Factory interface for instantiating an {@link EncryptedSettings} implementation.
 */
export interface SettingsFactory {
  /**
   * Constructs an {@link EncryptedSettings} store.
   *
   * @returns Initialized EncryptedSettings instance
   */
  create(): EncryptedSettings
}
