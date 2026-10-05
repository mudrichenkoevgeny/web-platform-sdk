import {
  managementGlobalSettingsPayloadSchema,
  toManagementGlobalSettings,
  toManagementGlobalSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettingsStorage } from '@/storage/globalsettings/ManagementGlobalSettingsStorage'

const KEY_MANAGEMENT_GLOBAL_SETTINGS = 'global_management_settings'

/** Storage implementation of {@link ManagementGlobalSettingsStorage} backed by {@link EncryptedSettings}. */
export class EncryptedManagementGlobalSettingsStorage implements ManagementGlobalSettingsStorage {
  /**
   * Constructs a new {@link EncryptedManagementGlobalSettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  public async getManagementGlobalSettings(): Promise<ManagementGlobalSettings | null> {
    const rawData = await this.encryptedSettings.get(KEY_MANAGEMENT_GLOBAL_SETTINGS)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = managementGlobalSettingsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_MANAGEMENT_GLOBAL_SETTINGS)
        return null
      }
      return toManagementGlobalSettings(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_MANAGEMENT_GLOBAL_SETTINGS)
      return null
    }
  }

  public async updateManagementGlobalSettings(settings: ManagementGlobalSettings): Promise<void> {
    const payload = toManagementGlobalSettingsPayload(settings)
    await this.encryptedSettings.put(KEY_MANAGEMENT_GLOBAL_SETTINGS, JSON.stringify(payload))
  }

  public async clearManagementGlobalSettings(): Promise<void> {
    await this.encryptedSettings.remove(KEY_MANAGEMENT_GLOBAL_SETTINGS)
  }
}
