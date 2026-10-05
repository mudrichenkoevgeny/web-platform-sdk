import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsStorage } from '@/storage/securitysettings/ManagementSecuritySettingsStorage'

/** Mock in-memory implementation of {@link ManagementSecuritySettingsStorage}. */
export class ManagementSecuritySettingsStorageMock implements ManagementSecuritySettingsStorage {
  public stored: ManagementSecuritySettings | null = null

  public constructor(initialSettings?: ManagementSecuritySettings) {
    if (initialSettings) {
      this.stored = initialSettings
    }
  }

  public async getManagementSecuritySettings(): Promise<ManagementSecuritySettings | null> {
    return this.stored
  }

  public async updateManagementSecuritySettings(
    managementSecuritySettings: ManagementSecuritySettings
  ): Promise<void> {
    this.stored = managementSecuritySettings
  }

  public async clearManagementSecuritySettings(): Promise<void> {
    this.stored = null
  }
}
