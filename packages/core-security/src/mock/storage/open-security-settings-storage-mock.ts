import type { OpenSecuritySettingsStorage } from '@/storage/security-settings/open-security-settings-storage'
import type { OpenSecuritySettings } from '@/domain/model/open-security-settings'

/**
 * Mock in-memory implementation of {@link OpenSecuritySettingsStorage}.
 */
export class OpenSecuritySettingsStorageMock implements OpenSecuritySettingsStorage {
  private settings: OpenSecuritySettings | null = null

  /**
   * Constructs a new {@link OpenSecuritySettingsStorageMock}.
   *
   * @param initialSettings - Initial cached settings
   */
  public constructor(initialSettings?: OpenSecuritySettings) {
    if (initialSettings) {
      this.settings = initialSettings
    }
  }

  /**
   * Retrieves the mock stored settings.
   *
   * @returns Mock settings or null
   */
  public async getOpenSecuritySettings(): Promise<OpenSecuritySettings | null> {
    return this.settings
  }

  /**
   * Updates the mock stored settings.
   *
   * @param securitySettings - New settings
   */
  public async updateOpenSecuritySettings(securitySettings: OpenSecuritySettings): Promise<void> {
    this.settings = securitySettings
  }

  /**
   * Clears the mock stored settings.
   */
  public async clearOpenSecuritySettings(): Promise<void> {
    this.settings = null
  }
}
