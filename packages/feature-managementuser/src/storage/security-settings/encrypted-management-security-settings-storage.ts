import {
  managementSecuritySettingsPayloadSchema,
  toManagementSecuritySettings,
  toManagementSecuritySettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettingsStorage } from '@/storage/securitysettings/ManagementSecuritySettingsStorage'

const KEY_MANAGEMENT_SECURITY_SETTINGS = 'security_management_settings'

/** Storage implementation of {@link ManagementSecuritySettingsStorage} backed by {@link EncryptedSettings}. */
export class EncryptedManagementSecuritySettingsStorage implements ManagementSecuritySettingsStorage {
  /**
   * Constructs a new {@link EncryptedManagementSecuritySettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  public async getManagementSecuritySettings(): Promise<ManagementSecuritySettings | null> {
    const rawData = await this.encryptedSettings.get(KEY_MANAGEMENT_SECURITY_SETTINGS)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = managementSecuritySettingsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_MANAGEMENT_SECURITY_SETTINGS)
        return null
      }
      return toManagementSecuritySettings(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_MANAGEMENT_SECURITY_SETTINGS)
      return null
    }
  }

  public async updateManagementSecuritySettings(settings: ManagementSecuritySettings): Promise<void> {
    const payload = toManagementSecuritySettingsPayload(settings)
    await this.encryptedSettings.put(KEY_MANAGEMENT_SECURITY_SETTINGS, JSON.stringify(payload))
  }

  public async clearManagementSecuritySettings(): Promise<void> {
    await this.encryptedSettings.remove(KEY_MANAGEMENT_SECURITY_SETTINGS)
  }
}
