import { openSecuritySettingsPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenSecuritySettingsStorage } from '@/storage/security-settings/open-security-settings-storage'
import {
  toOpenSecuritySettings,
  toOpenSecuritySettingsPayload
} from '@/domain/model/open-security-settings'
import type { OpenSecuritySettings } from '@/domain/model/open-security-settings'

const KEY_SECURITY_SETTINGS = 'security_settings'

/**
 * Storage implementation of {@link OpenSecuritySettingsStorage} backed by {@link EncryptedSettings}.
 */
export class EncryptedOpenSecuritySettingsStorage implements OpenSecuritySettingsStorage {
  /**
   * Constructs a new {@link EncryptedOpenSecuritySettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Retrieves and deserializes encrypted open security settings.
   *
   * @returns Deserialized settings or null if unreadable or absent
   */
  public async getOpenSecuritySettings(): Promise<OpenSecuritySettings | null> {
    const rawData = await this.encryptedSettings.get(KEY_SECURITY_SETTINGS)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = openSecuritySettingsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_SECURITY_SETTINGS)
        return null
      }
      return toOpenSecuritySettings(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_SECURITY_SETTINGS)
      return null
    }
  }

  /**
   * Serializes and persists open security settings.
   *
   * @param securitySettings - Security settings snapshot to store
   */
  public async updateOpenSecuritySettings(securitySettings: OpenSecuritySettings): Promise<void> {
    const payload = toOpenSecuritySettingsPayload(securitySettings)
    const jsonString = JSON.stringify(payload)
    await this.encryptedSettings.put(KEY_SECURITY_SETTINGS, jsonString)
  }

  /**
   * Removes persisted open security settings from storage.
   */
  public async clearOpenSecuritySettings(): Promise<void> {
    await this.encryptedSettings.remove(KEY_SECURITY_SETTINGS)
  }
}
