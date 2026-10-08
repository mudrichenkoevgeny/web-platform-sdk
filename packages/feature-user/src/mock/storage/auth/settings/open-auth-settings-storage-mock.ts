import type { OpenAuthSettingsStorage } from '@/storage/auth/settings/open-auth-settings-storage'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Mock implementation of {@link OpenAuthSettingsStorage}.
 */
export class OpenAuthSettingsStorageMock implements OpenAuthSettingsStorage {
  public stored: OpenAuthSettings | null = null

  public async getOpenAuthSettings(): Promise<OpenAuthSettings | null> {
    return this.stored
  }

  public async updateOpenAuthSettings(openAuthSettings: OpenAuthSettings): Promise<void> {
    this.stored = openAuthSettings
  }

  public async clearOpenAuthSettings(): Promise<void> {
    this.stored = null
  }
}
