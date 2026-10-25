import {
  managementStorageSettingsPayloadSchema,
  toManagementStorageSettings,
  toManagementStorageSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettingsStorage } from '@/storage/storage-settings/management-storage-settings-storage'

const KEY_MANAGEMENT_STORAGE_SETTINGS = 'storage_management_settings'

/** Storage implementation of {@link ManagementStorageSettingsStorage} backed by {@link EncryptedSettings}. */
export class EncryptedManagementStorageSettingsStorage implements ManagementStorageSettingsStorage {
  /**
   * Constructs a new {@link EncryptedManagementStorageSettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Retrieves and deserializes encrypted management storage settings.
   *
   * @returns Deserialized settings or null if unreadable or absent
   */
  public async getManagementStorageSettings(): Promise<ManagementStorageSettings | null> {
    const rawData = await this.encryptedSettings.get(KEY_MANAGEMENT_STORAGE_SETTINGS)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = managementStorageSettingsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_MANAGEMENT_STORAGE_SETTINGS)
        return null
      }
      return toManagementStorageSettings(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_MANAGEMENT_STORAGE_SETTINGS)
      return null
    }
  }

  /**
   * Serializes and persists management storage settings.
   *
   * @param settings - Storage settings snapshot to store
   */
  public async updateManagementStorageSettings(settings: ManagementStorageSettings): Promise<void> {
    const payload = toManagementStorageSettingsPayload(settings)
    await this.encryptedSettings.put(KEY_MANAGEMENT_STORAGE_SETTINGS, JSON.stringify(payload))
  }

  /**
   * Removes persisted management storage settings from storage.
   */
  public async clearManagementStorageSettings(): Promise<void> {
    await this.encryptedSettings.remove(KEY_MANAGEMENT_STORAGE_SETTINGS)
  }
}
