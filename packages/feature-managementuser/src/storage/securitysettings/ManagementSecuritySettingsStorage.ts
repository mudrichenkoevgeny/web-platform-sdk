import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'

/** Persistence port for {@link ManagementSecuritySettings} storage implementations. */
export interface ManagementSecuritySettingsStorage {
  /**
   * Retrieves the stored {@link ManagementSecuritySettings}, or null if none are persisted yet.
   *
   * @returns Stored settings or null
   */
  getManagementSecuritySettings(): Promise<ManagementSecuritySettings | null>

  /**
   * Persists a new snapshot of {@link ManagementSecuritySettings}.
   *
   * @param settings - Snapshot to serialize and persist
   */
  updateManagementSecuritySettings(settings: ManagementSecuritySettings): Promise<void>

  /**
   * Removes persisted management security settings from storage.
   */
  clearManagementSecuritySettings(): Promise<void>
}
