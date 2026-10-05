import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsStorage } from '@/storage/auth/settings/ManagementAuthSettingsStorage'

/** Mock in-memory implementation of {@link ManagementAuthSettingsStorage}. */
export class ManagementAuthSettingsStorageMock implements ManagementAuthSettingsStorage {
  public stored: ManagementAuthSettings | null = null

  public constructor(initialSettings?: ManagementAuthSettings) {
    if (initialSettings) {
      this.stored = initialSettings
    }
  }

  public async getManagementAuthSettings(): Promise<ManagementAuthSettings | null> {
    return this.stored
  }

  public async updateManagementAuthSettings(managementAuthSettings: ManagementAuthSettings): Promise<void> {
    this.stored = managementAuthSettings
  }

  public async clearManagementAuthSettings(): Promise<void> {
    this.stored = null
  }
}
