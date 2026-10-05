import {
  managementAuthSettingsPayloadSchema,
  toManagementAuthSettings,
  toManagementAuthSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettingsStorage } from '@/storage/auth/settings/ManagementAuthSettingsStorage'

const KEY_MANAGEMENT_AUTH_SETTINGS = 'auth_management_settings'

/** Storage implementation of {@link ManagementAuthSettingsStorage} backed by {@link EncryptedSettings}. */
export class EncryptedManagementAuthSettingsStorage implements ManagementAuthSettingsStorage {
  /**
   * Constructs a new {@link EncryptedManagementAuthSettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  public async getManagementAuthSettings(): Promise<ManagementAuthSettings | null> {
    const rawData = await this.encryptedSettings.get(KEY_MANAGEMENT_AUTH_SETTINGS)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = managementAuthSettingsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_MANAGEMENT_AUTH_SETTINGS)
        return null
      }
      return toManagementAuthSettings(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_MANAGEMENT_AUTH_SETTINGS)
      return null
    }
  }

  public async updateManagementAuthSettings(settings: ManagementAuthSettings): Promise<void> {
    const payload = toManagementAuthSettingsPayload(settings)
    await this.encryptedSettings.put(KEY_MANAGEMENT_AUTH_SETTINGS, JSON.stringify(payload))
  }

  public async clearManagementAuthSettings(): Promise<void> {
    await this.encryptedSettings.remove(KEY_MANAGEMENT_AUTH_SETTINGS)
  }
}
