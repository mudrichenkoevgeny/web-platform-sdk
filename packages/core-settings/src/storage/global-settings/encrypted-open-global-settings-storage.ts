import { openGlobalSettingsPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenGlobalSettingsStorage } from '@/storage/global-settings/open-global-settings-storage'
import {
  toOpenGlobalSettings,
  toOpenGlobalSettingsPayload
} from '@/domain/model/open-global-settings'
import type { OpenGlobalSettings } from '@/domain/model/open-global-settings'

const KEY_GLOBAL_SETTINGS = 'global_settings'

/**
 * Storage implementation of {@link OpenGlobalSettingsStorage} backed by {@link EncryptedSettings}.
 */
export class EncryptedOpenGlobalSettingsStorage implements OpenGlobalSettingsStorage {
  /**
   * Constructs a new {@link EncryptedOpenGlobalSettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Retrieves and deserializes encrypted open global settings.
   *
   * @returns Deserialized settings or null if unreadable or absent
   */
  public async getOpenGlobalSettings(): Promise<OpenGlobalSettings | null> {
    const rawData = await this.encryptedSettings.get(KEY_GLOBAL_SETTINGS)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = openGlobalSettingsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_GLOBAL_SETTINGS)
        return null
      }
      return toOpenGlobalSettings(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_GLOBAL_SETTINGS)
      return null
    }
  }

  /**
   * Serializes and persists open global settings.
   *
   * @param globalSettings - Global settings snapshot to store
   */
  public async updateOpenGlobalSettings(globalSettings: OpenGlobalSettings): Promise<void> {
    const payload = toOpenGlobalSettingsPayload(globalSettings)
    const jsonString = JSON.stringify(payload)
    await this.encryptedSettings.put(KEY_GLOBAL_SETTINGS, jsonString)
  }

  /**
   * Removes persisted open global settings from storage.
   */
  public async clearOpenGlobalSettings(): Promise<void> {
    await this.encryptedSettings.remove(KEY_GLOBAL_SETTINGS)
  }
}
