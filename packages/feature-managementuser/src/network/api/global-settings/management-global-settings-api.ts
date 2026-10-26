import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch and update global settings in management scope. */
export interface ManagementGlobalSettingsApi {
  /**
   * Loads global application configuration.
   *
   * @returns ManagementGlobalSettingsPayload on success, or an error result
   */
  getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>>

  /**
   * Pushes updated global application settings to the server.
   *
   * @param request - Complete updated settings payload
   * @returns Updated ManagementGlobalSettingsPayload on success, or an error result
   */
  updateManagementGlobalSettings(request: ManagementGlobalSettingsPayload): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>>

  /**
   * Resets global application settings to defaults.
   *
   * @returns Fresh default ManagementGlobalSettingsPayload on success, or an error result
   */
  resetManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>>
}
