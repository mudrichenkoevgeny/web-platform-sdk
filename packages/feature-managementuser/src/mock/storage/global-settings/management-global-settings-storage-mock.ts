import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsStorage } from '@/storage/globalsettings/ManagementGlobalSettingsStorage'

/** Mock in-memory implementation of {@link ManagementGlobalSettingsStorage}. */
export class ManagementGlobalSettingsStorageMock implements ManagementGlobalSettingsStorage {
  public stored: ManagementGlobalSettings | null = null

  public constructor(initialSettings?: ManagementGlobalSettings) {
    if (initialSettings) {
      this.stored = initialSettings
    }
  }

  public async getManagementGlobalSettings(): Promise<ManagementGlobalSettings | null> {
    return this.stored
  }

  public async updateManagementGlobalSettings(managementGlobalSettings: ManagementGlobalSettings): Promise<void> {
    this.stored = managementGlobalSettings
  }

  public async clearManagementGlobalSettings(): Promise<void> {
    this.stored = null
  }
}
