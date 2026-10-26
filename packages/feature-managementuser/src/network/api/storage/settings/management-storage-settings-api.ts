import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch and update storage settings in management scope. */
export interface ManagementStorageSettingsApi {
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
