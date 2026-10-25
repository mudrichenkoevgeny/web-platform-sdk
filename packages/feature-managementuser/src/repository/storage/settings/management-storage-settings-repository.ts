import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Storage settings repository for management: fetch, push updates, refresh, and observe.
 */
export interface ManagementStorageSettingsRepository {
  /**
   * Returns cached settings when already loaded or stored; otherwise loads from network or storage.
   *
   * @returns ManagementStorageSettings on success, or an error result
   */
  getManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Pushes storageSettings to the remote server and updates local state on success.
   *
   * @param storageSettings - New storage configuration payload to apply
   * @returns Empty success indicator, or an error result
   */
  saveRemoteManagementStorageSettings(storageSettings: ManagementStorageSettings): Promise<AppResult<void, AppError>>

  /**
   * Resets storage settings on the remote server to default values and updates local state.
   *
   * @returns Fresh ManagementStorageSettings on success, or an error result
   */
  resetRemoteManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Forces a network reload and updates the observable snapshot on success.
   *
   * @returns Fresh ManagementStorageSettings on success, or an error result
   */
  refreshManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Persists storageSettings locally and publishes them to observers.
   *
   * @param storageSettings - Complete settings payload to apply
   */
  updateManagementStorageSettings(storageSettings: ManagementStorageSettings): Promise<void>

  /**
   * Observes the in-memory settings snapshot.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  observeManagementStorageSettings(listener: (settings: ManagementStorageSettings | null) => void): () => void
}
