import type { OpenGlobalSettingsStorage } from '@/storage/global-settings/open-global-settings-storage'
import type { OpenGlobalSettings } from '@/domain/model/open-global-settings'

/**
 * Mock in-memory implementation of {@link OpenGlobalSettingsStorage}.
 */
export class OpenGlobalSettingsStorageMock implements OpenGlobalSettingsStorage {
  private settings: OpenGlobalSettings | null = null

  /**
   * Constructs a new {@link OpenGlobalSettingsStorageMock}.
   *
   * @param initialSettings - Initial cached settings
   */
  public constructor(initialSettings?: OpenGlobalSettings) {
    if (initialSettings) {
      this.settings = initialSettings
    }
  }

  /**
   * Retrieves the mock stored global settings.
   *
   * @returns Mock settings or null
   */
  public async getOpenGlobalSettings(): Promise<OpenGlobalSettings | null> {
    return this.settings
  }

  /**
   * Updates the mock stored global settings.
   *
   * @param globalSettings - New settings
   */
  public async updateOpenGlobalSettings(globalSettings: OpenGlobalSettings): Promise<void> {
    this.settings = globalSettings
  }

  /**
   * Clears the mock stored global settings.
   */
  public async clearOpenGlobalSettings(): Promise<void> {
    this.settings = null
  }
}
