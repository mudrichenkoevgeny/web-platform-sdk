import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Persistence port for {@link OpenStorageSettings} storage implementations.
 */
export interface OpenStorageSettingsStorage {
  /**
   * Retrieves the stored {@link OpenStorageSettings}, or null if none are persisted yet.
   *
   * @returns Promise resolving to stored settings or null
   */
  getOpenStorageSettings(): Promise<OpenStorageSettings | null>

  /**
   * Persists a new snapshot of {@link OpenStorageSettings}.
   *
   * @param storageSettings - Snapshot to serialize and persist
   */
  updateOpenStorageSettings(storageSettings: OpenStorageSettings): Promise<void>

  /**
   * Removes persisted open storage settings from storage, if present.
   */
  clearOpenStorageSettings(): Promise<void>
}
