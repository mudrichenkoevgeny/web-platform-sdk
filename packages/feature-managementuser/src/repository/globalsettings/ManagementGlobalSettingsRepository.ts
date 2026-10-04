import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Global application settings repository for management: fetch, push updates, refresh, and observe.
 */
export interface ManagementGlobalSettingsRepository {
  /**
   * Returns cached settings when already loaded or stored; otherwise loads from network or storage.
   *
   * @returns ManagementGlobalSettings on success, or an error result
   */
  getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>>

  /**
   * Pushes globalSettings to the remote server and updates local state on success.
   *
   * @param globalSettings - New global configuration payload to apply
   * @returns Empty success indicator, or an error result
   */
  saveRemoteManagementGlobalSettings(globalSettings: ManagementGlobalSettings): Promise<AppResult<void, AppError>>

  /**
   * Resets global settings on the remote server to default values and updates local state.
   *
   * @returns Fresh ManagementGlobalSettings on success, or an error result
   */
  resetRemoteManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>>

  /**
   * Forces a network reload and updates the observable snapshot on success.
   *
   * @returns Fresh ManagementGlobalSettings on success, or an error result
   */
  refreshManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>>

  /**
   * Persists globalSettings locally and publishes them to observers.
   *
   * @param globalSettings - Complete settings payload to apply
   */
  updateManagementGlobalSettings(globalSettings: ManagementGlobalSettings): Promise<void>

  /**
   * Observes the in-memory settings snapshot.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  observeManagementGlobalSettings(listener: (settings: ManagementGlobalSettings | null) => void): () => void
}
