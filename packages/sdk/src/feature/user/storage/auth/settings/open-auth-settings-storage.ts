import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Interface for persisting cached open authentication settings.
 */
export interface OpenAuthSettingsStorage {
  /**
   * Retrieves last known open auth settings snapshot, or null if never loaded.
   *
   * @returns Open auth settings snapshot or null
   */
  getOpenAuthSettings(): Promise<OpenAuthSettings | null>

  /**
   * Replaces cached open provider/policy settings.
   *
   * @param openAuthSettings - New open auth settings to persist
   */
  updateOpenAuthSettings(openAuthSettings: OpenAuthSettings): Promise<void>

  /**
   * Clears cached open auth settings.
   */
  clearOpenAuthSettings(): Promise<void>
}
