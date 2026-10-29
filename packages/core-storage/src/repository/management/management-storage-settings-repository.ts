import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { UpdateManagementStorageSettingsRequest } from '../../network/api/management/management-storage-settings-api'

/** Observer callback type for management storage settings. */
export type ManagementStorageSettingsObserver = (settings: ManagementStorageSettings) => void

/**
 * Repository interface for administrative management storage settings.
 */
export interface ManagementStorageSettingsRepository {
  /**
   * Retrieves management storage settings from local encrypted storage or fetches from API if not cached.
   *
   * @returns AppResult containing cached or fetched {@link ManagementStorageSettings}
   */
  getSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Bypasses local cache, fetches fresh management storage settings from API, and updates local cache.
   *
   * @returns AppResult containing fresh {@link ManagementStorageSettings}
   */
  refreshSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Updates management storage settings via API and updates local cache upon success.
   *
   * @param request - DTO containing settings fields to update
   * @returns AppResult containing updated {@link ManagementStorageSettings}
   */
  updateSettings(
    request: UpdateManagementStorageSettingsRequest
  ): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Resets management storage settings to default values via API and clears local cache.
   *
   * @returns AppResult containing default {@link ManagementStorageSettings}
   */
  resetSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Registers an observer callback triggered on live WebSocket or internal settings updates.
   *
   * @param observer - Callback function invoked with updated settings
   * @returns Unsubscribe cleanup function
   */
  observeSettings(observer: ManagementStorageSettingsObserver): () => void
}
