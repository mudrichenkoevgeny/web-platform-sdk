import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Persistence port for {@link ManagementAuthSettings} storage implementations. */
export interface ManagementAuthSettingsStorage {
  /**
   * Retrieves the stored {@link ManagementAuthSettings}, or null if none are persisted yet.
   *
   * @returns Stored settings or null
   */
  getManagementAuthSettings(): Promise<ManagementAuthSettings | null>

  /**
   * Persists a new snapshot of {@link ManagementAuthSettings}.
   *
   * @param settings - Snapshot to serialize and persist
   */
  updateManagementAuthSettings(settings: ManagementAuthSettings): Promise<void>

  /**
   * Removes persisted management auth settings from storage.
   */
  clearManagementAuthSettings(): Promise<void>
}
