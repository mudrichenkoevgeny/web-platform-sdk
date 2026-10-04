import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Auth-related remote settings: fetch, refresh, push updates, and observe the latest snapshot.
 */
export interface ManagementAuthSettingsRepository {
  /**
   * Returns cached settings when already loaded or stored; otherwise loads from the network or storage.
   *
   * @returns ManagementAuthSettings on success, or an error result
   */
  getManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>>

  /**
   * Pushes authSettings to the remote server and updates local storage and observers on success.
   *
   * @param authSettings - New configuration payload to apply
   * @returns Empty success indicator, or an error result
   */
  saveRemoteManagementAuthSettings(authSettings: ManagementAuthSettings): Promise<AppResult<void, AppError>>

  /**
   * Resets auth settings on the remote server to default values and updates local state.
   *
   * @returns Fresh ManagementAuthSettings on success, or an error result
   */
  resetRemoteManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>>

  /**
   * Forces a network reload and updates the observable snapshot on success.
   *
   * @returns Fresh ManagementAuthSettings on success, or an error result
   */
  refreshManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>>

  /**
   * Persists authSettings locally and publishes them to observers.
   *
   * @param authSettings - Complete settings payload to apply
   */
  updateManagementAuthSettings(authSettings: ManagementAuthSettings): Promise<void>

  /**
   * Observes the in-memory settings snapshot.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  observeManagementAuthSettings(listener: (settings: ManagementAuthSettings | null) => void): () => void
}
