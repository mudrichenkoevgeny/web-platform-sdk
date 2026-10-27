import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettingsPayload, OpenStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch and update storage settings in management scope. */
export interface ManagementStorageSettingsApi {
  /**
   * Loads open storage settings for unauthenticated management users.
   *
   * @returns OpenStorageSettingsPayload on success, or an error result
   */
  getOpenStorageSettings(): Promise<AppResult<OpenStorageSettingsPayload, AppError>>

  /**
   * Loads storage settings.
   *
   * @returns ManagementStorageSettingsPayload on success, or an error result
   */
  getManagementStorageSettings(): Promise<AppResult<ManagementStorageSettingsPayload, AppError>>

  /**
   * Pushes updated storage settings to the server.
   *
   * @param request - Complete updated settings payload
   * @returns Updated ManagementStorageSettingsPayload on success, or an error result
   */
  updateManagementStorageSettings(
    request: ManagementStorageSettingsPayload
  ): Promise<AppResult<ManagementStorageSettingsPayload, AppError>>

  /**
   * Resets storage settings to defaults.
   *
   * @returns Fresh default ManagementStorageSettingsPayload on success, or an error result
   */
  resetManagementStorageSettings(): Promise<AppResult<ManagementStorageSettingsPayload, AppError>>
}
