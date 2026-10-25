import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Persistence port for {@link ManagementStorageSettings} storage implementations. */
export interface ManagementStorageSettingsStorage {
  /**
   * Retrieves the stored {@link ManagementStorageSettings}, or null if none are persisted yet.
   *
   * @returns Stored settings or null
   */
  getManagementStorageSettings(): Promise<ManagementStorageSettings | null>

  /**
   * Persists a new snapshot of {@link ManagementStorageSettings}.
   *
   * @param settings - Snapshot to serialize and persist
   */
  updateManagementStorageSettings(settings: ManagementStorageSettings): Promise<void>

  /**
   * Removes persisted management storage settings from storage.
   */
  clearManagementStorageSettings(): Promise<void>
}
