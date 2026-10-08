import { openAuthSettingsPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenAuthSettingsStorage } from '@/storage/auth/settings/open-auth-settings-storage'
import {
  toOpenAuthSettings,
  toOpenAuthSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenAuthSettings } from "@mudrichenkoevgeny/shared-foundation";

const KEY_OPEN_AUTH_SETTINGS = 'auth_open_settings'

/**
 * Storage implementation of {@link OpenAuthSettingsStorage} backed by {@link EncryptedSettings}.
 */
export class EncryptedOpenAuthSettingsStorage implements OpenAuthSettingsStorage {
  /**
   * Constructs a new {@link EncryptedOpenAuthSettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Retrieves and deserializes encrypted open auth settings.
   *
   * @returns Deserialized settings or null if unreadable or absent
   */
  public async getOpenAuthSettings(): Promise<OpenAuthSettings | null> {
    const rawData = await this.encryptedSettings.get(KEY_OPEN_AUTH_SETTINGS)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = openAuthSettingsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_OPEN_AUTH_SETTINGS)
        return null
      }
      return toOpenAuthSettings(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_OPEN_AUTH_SETTINGS)
      return null
    }
  }

  /**
   * Serializes and persists open auth settings.
   *
   * @param openAuthSettings - Settings snapshot to store
   */
  public async updateOpenAuthSettings(openAuthSettings: OpenAuthSettings): Promise<void> {
    const payload = toOpenAuthSettingsPayload(openAuthSettings)
    const jsonString = JSON.stringify(payload)
    await this.encryptedSettings.put(KEY_OPEN_AUTH_SETTINGS, jsonString)
  }

  /**
   * Removes cached open auth settings from storage.
   */
  public async clearOpenAuthSettings(): Promise<void> {
    await this.encryptedSettings.remove(KEY_OPEN_AUTH_SETTINGS)
  }
}
