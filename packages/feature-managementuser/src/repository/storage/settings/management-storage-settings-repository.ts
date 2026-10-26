import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Management storage configuration: fetch, refresh, push updates, and observe state changes. */
export interface ManagementStorageSettingsRepository {
  /**
   * Returns cached storage settings when present; otherwise falls back to local storage or network fetch.
   *
   * @returns ManagementStorageSettings on success, or an error result
   */
  getManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Pushes updated storage settings to the remote server and refreshes local state on success.
   *
   * @param storageSettings - New storage settings to apply
   * @returns Fresh ManagementStorageSettings on success, or an error result
   */
  saveRemoteManagementStorageSettings(
    storageSettings: ManagementStorageSettings
  ): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Resets storage settings to defaults on the remote server and updates local state on success.
   *
   * @returns Fresh ManagementStorageSettings on success, or an error result
   */
  resetRemoteManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Forces a network reload of storage settings and updates observable state on success.
   *
   * @returns Fresh ManagementStorageSettings on success, or an error result
   */
  refreshManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Persists storage settings locally and notifies active observers.
   *
   * @param storageSettings - New settings instance
   */
  updateManagementStorageSettings(storageSettings: ManagementStorageSettings): Promise<void>

  /**
   * Subscribes to live in-memory updates for storage settings.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  observeManagementStorageSettings(listener: (settings: ManagementStorageSettings | null) => void): () => void
}
