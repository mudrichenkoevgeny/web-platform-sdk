import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Security settings repository for management: fetch, push updates, refresh, and observe.
 */
export interface ManagementSecuritySettingsRepository {
  /**
   * Returns cached settings when already loaded or stored; otherwise loads from network or storage.
   *
   * @returns ManagementSecuritySettings on success, or an error result
   */
  getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>>

  /**
   * Pushes securitySettings to the remote server and updates local state on success.
   *
   * @param securitySettings - New security configuration payload to apply
   * @returns Empty success indicator, or an error result
   */
  saveRemoteManagementSecuritySettings(securitySettings: ManagementSecuritySettings): Promise<AppResult<void, AppError>>

  /**
   * Resets security settings on the remote server to default values and updates local state.
   *
   * @returns Fresh ManagementSecuritySettings on success, or an error result
   */
  resetRemoteManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>>

  /**
   * Forces a network reload and updates the observable snapshot on success.
   *
   * @returns Fresh ManagementSecuritySettings on success, or an error result
   */
  refreshManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>>

  /**
   * Persists securitySettings locally and publishes them to observers.
   *
   * @param securitySettings - Complete settings payload to apply
   */
  updateManagementSecuritySettings(securitySettings: ManagementSecuritySettings): Promise<void>

  /**
   * Observes the in-memory settings snapshot.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  observeManagementSecuritySettings(listener: (settings: ManagementSecuritySettings | null) => void): () => void
}
