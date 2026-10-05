import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch and update global application settings via the management API. */
export interface ManagementGlobalSettingsApi {
  /**
   * Fetches global settings for management.
   *
   * @returns ManagementGlobalSettingsPayload or a mapped failure
   */
  getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>>

  /**
   * Updates platform-wide global settings.
   *
   * @param request - New global settings payload
   * @returns Void result or a mapped failure
   */
  updateManagementGlobalSettings(request: ManagementGlobalSettingsPayload): Promise<AppResult<void, AppError>>

  /**
   * Resets platform-wide global settings to default values.
   *
   * @returns Fresh default ManagementGlobalSettingsPayload, or a mapped failure
   */
  resetManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>>
}
