import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Management-scope global configuration: fetch, refresh, push updates, and observe state changes. */
export interface ManagementGlobalSettingsRepository {
  /**
   * Returns cached settings when present; otherwise falls back to local storage or network fetch.
   *
   * @returns ManagementGlobalSettings on success, or an error result
   */
  getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>>

  /**
   * Pushes updated global application settings to the remote server and refreshes local state on success.
   *
   * @param globalSettings - New global application settings to apply
   * @returns Fresh ManagementGlobalSettings on success, or an error result
   */
  saveRemoteManagementGlobalSettings(
    globalSettings: ManagementGlobalSettings
  ): Promise<AppResult<ManagementGlobalSettings, AppError>>

  /**
   * Resets global application settings to defaults on the remote server and updates local state on success.
   *
   * @returns Fresh ManagementGlobalSettings on success, or an error result
   */
  resetRemoteManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>>

  /**
   * Forces a network reload of global settings and updates the observable state on success.
   *
   * @returns Fresh ManagementGlobalSettings on success, or an error result
   */
  refreshManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>>

  /**
   * Persists global settings locally and notifies active observers.
   *
   * @param globalSettings - New settings instance
   */
  updateManagementGlobalSettings(globalSettings: ManagementGlobalSettings): Promise<void>

  /**
   * Subscribes to live in-memory updates for global settings.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  observeManagementGlobalSettings(listener: (settings: ManagementGlobalSettings | null) => void): () => void
}
