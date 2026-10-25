import type { OpenStorageSettingsStorage } from '../../storage/storage-settings/open-storage-settings-storage'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

export class OpenStorageSettingsStorageMock implements OpenStorageSettingsStorage {
  public constructor(public settings: OpenStorageSettings | null = null) {}

  public async getOpenStorageSettings(): Promise<OpenStorageSettings | null> {
    return this.settings
  }

  public async updateOpenStorageSettings(storageSettings: OpenStorageSettings): Promise<void> {
    this.settings = storageSettings
  }

  public async clearOpenStorageSettings(): Promise<void> {
    this.settings = null
  }
}
