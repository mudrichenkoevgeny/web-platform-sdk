import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Persistence port for {@link ManagementGlobalSettings} storage implementations. */
export interface ManagementGlobalSettingsStorage {
  /**
   * Retrieves the stored {@link ManagementGlobalSettings}, or null if none are persisted yet.
   *
   * @returns Stored settings or null
   */
  getManagementGlobalSettings(): Promise<ManagementGlobalSettings | null>

  /**
   * Persists a new snapshot of {@link ManagementGlobalSettings}.
   *
   * @param settings - Snapshot to serialize and persist
   */
  updateManagementGlobalSettings(settings: ManagementGlobalSettings): Promise<void>

  /**
   * Removes persisted management global settings from storage.
   */
  clearManagementGlobalSettings(): Promise<void>
}
