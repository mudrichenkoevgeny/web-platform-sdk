import type { ManagementStorageSettingsStorage } from '@/storage/storage-settings/management-storage-settings-storage'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

export class ManagementStorageSettingsStorageMock implements ManagementStorageSettingsStorage {
  private settings: ManagementStorageSettings | null = null

  public constructor(initialSettings?: ManagementStorageSettings) {
    if (initialSettings) {
      this.settings = initialSettings
    }
  }

  public async getManagementStorageSettings(): Promise<ManagementStorageSettings | null> {
    return this.settings
  }

  public async updateManagementStorageSettings(settings: ManagementStorageSettings): Promise<void> {
    this.settings = settings
  }

  public async clearManagementStorageSettings(): Promise<void> {
    this.settings = null
  }
}
