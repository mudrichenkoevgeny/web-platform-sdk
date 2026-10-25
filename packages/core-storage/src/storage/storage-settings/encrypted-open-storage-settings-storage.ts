import {
  openStorageSettingsPayloadSchema,
  toOpenStorageSettings,
  toOpenStorageSettingsPayload,
  type OpenStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsStorage } from './open-storage-settings-storage'

const KEY_STORAGE_SETTINGS = 'storage_settings'

/**
 * Storage implementation of {@link OpenStorageSettingsStorage} backed by {@link EncryptedSettings}.
 */
export class EncryptedOpenStorageSettingsStorage implements OpenStorageSettingsStorage {
  /**
   * Constructs a new {@link EncryptedOpenStorageSettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Retrieves and deserializes encrypted open storage settings.
   *
   * @returns Deserialized settings or null if unreadable or absent
   */
  public async getOpenStorageSettings(): Promise<OpenStorageSettings | null> {
    const rawData = await this.encryptedSettings.get(KEY_STORAGE_SETTINGS)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = openStorageSettingsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_STORAGE_SETTINGS)
        return null
      }
      return toOpenStorageSettings(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_STORAGE_SETTINGS)
      return null
    }
  }

  /**
   * Serializes and persists open storage settings.
   *
   * @param storageSettings - Storage settings snapshot to store
   */
  public async updateOpenStorageSettings(storageSettings: OpenStorageSettings): Promise<void> {
    const payload = toOpenStorageSettingsPayload(storageSettings)
    const jsonString = JSON.stringify(payload)
    await this.encryptedSettings.put(KEY_STORAGE_SETTINGS, jsonString)
  }

  /**
   * Removes persisted open storage settings from storage.
   */
  public async clearOpenStorageSettings(): Promise<void> {
    await this.encryptedSettings.remove(KEY_STORAGE_SETTINGS)
  }
}
