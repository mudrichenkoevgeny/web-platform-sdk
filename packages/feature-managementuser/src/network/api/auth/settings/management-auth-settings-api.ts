import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch and update authentication settings for the signed-in user. */
export interface ManagementAuthSettingsApi {
  /**
   * Loads auth-related settings for the current session.
   *
   * @returns Settings DTO from the shared contract, or a mapped failure
   */
  getManagementAuthSettings(): Promise<AppResult<ManagementAuthSettingsPayload, AppError>>

  /**
   * Updates authentication settings and policies for the current account.
   *
   * @param request - New authentication settings payload
   * @returns Void result or a mapped failure
   */
  updateManagementAuthSettings(request: ManagementAuthSettingsPayload): Promise<AppResult<void, AppError>>

  /**
   * Resets global authentication settings to default values.
   *
   * @returns Fresh default ManagementAuthSettingsPayload, or a mapped failure
   */
  resetManagementAuthSettings(): Promise<AppResult<ManagementAuthSettingsPayload, AppError>>
}
