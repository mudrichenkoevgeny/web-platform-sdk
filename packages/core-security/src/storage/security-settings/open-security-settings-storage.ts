import { OpenSecuritySettings } from '@/domain/model/open-security-settings'

/**
 * Persistence port for {@link OpenSecuritySettings} storage implementations.
 */
export interface OpenSecuritySettingsStorage {
  /**
   * Retrieves the stored {@link OpenSecuritySettings}, or null if none are persisted yet.
   *
   * @returns Promise resolving to stored settings or null
   */
  getOpenSecuritySettings(): Promise<OpenSecuritySettings | null>

  /**
   * Persists a new snapshot of {@link OpenSecuritySettings}.
   *
   * @param securitySettings - Snapshot to serialize and persist
   */
  updateOpenSecuritySettings(securitySettings: OpenSecuritySettings): Promise<void>

  /**
   * Removes persisted open security settings from storage, if present.
   */
  clearOpenSecuritySettings(): Promise<void>
}
