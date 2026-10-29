import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Storage interface for caching management storage settings locally.
 */
export interface ManagementStorageSettingsStorage {
  /**
   * Reads cached management storage settings from local encrypted storage.
   *
   * @returns AppResult containing cached {@link ManagementStorageSettings} or null if cache is empty
   */
  getSettings(): Promise<AppResult<ManagementStorageSettings | null, AppError>>

  /**
   * Persists management storage settings into local encrypted storage.
   *
   * @param settings - Management storage settings object to cache
   * @returns AppResult containing void on success
   */
  saveSettings(settings: ManagementStorageSettings): Promise<AppResult<void, AppError>>

  /**
   * Clears cached management storage settings from local encrypted storage.
   *
   * @returns AppResult containing void on success
   */
  clearSettings(): Promise<AppResult<void, AppError>>
}
