import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch and update security settings via the management API. */
export interface ManagementSecuritySettingsApi {
  /**
   * Fetches security settings for management.
   *
   * @returns ManagementSecuritySettingsPayload or a mapped failure
   */
  getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>>

  /**
   * Updates platform-wide security settings and policies.
   *
   * @param request - New security settings payload
   * @returns Void result or a mapped failure
   */
  updateManagementSecuritySettings(request: ManagementSecuritySettingsPayload): Promise<AppResult<void, AppError>>

  /**
   * Resets global security settings and policies to default values.
   *
   * @returns Fresh default ManagementSecuritySettingsPayload, or a mapped failure
   */
  resetManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>>
}
