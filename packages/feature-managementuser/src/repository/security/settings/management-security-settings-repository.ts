import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'

/** Management security configuration: fetch, refresh, push updates, and observe state changes. */
export interface ManagementSecuritySettingsRepository {
  /**
   * Returns cached security settings when present; otherwise falls back to local storage or network fetch.
   *
   * @returns ManagementSecuritySettings on success, or an error result
   */
  getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>>

  /**
   * Pushes updated security settings to the remote server and refreshes local state on success.
   *
   * @param securitySettings - New security settings to apply
   * @returns Fresh ManagementSecuritySettings on success, or an error result
   */
  saveRemoteManagementSecuritySettings(
    securitySettings: ManagementSecuritySettings
  ): Promise<AppResult<ManagementSecuritySettings, AppError>>

  /**
   * Resets security settings to defaults on the remote server and updates local state on success.
   *
   * @returns Fresh ManagementSecuritySettings on success, or an error result
   */
  resetRemoteManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>>

  /**
   * Forces a network reload of security settings and updates observable state on success.
   *
   * @returns Fresh ManagementSecuritySettings on success, or an error result
   */
  refreshManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>>

  /**
   * Persists security settings locally and notifies active observers.
   *
   * @param securitySettings - New settings instance
   */
  updateManagementSecuritySettings(securitySettings: ManagementSecuritySettings): Promise<void>

  /**
   * Subscribes to live in-memory updates for security settings.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  observeManagementSecuritySettings(listener: (settings: ManagementSecuritySettings | null) => void): () => void
}
