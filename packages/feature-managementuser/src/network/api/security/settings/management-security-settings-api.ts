import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettingsPayload, OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch and update security settings in management scope. */
export interface ManagementSecuritySettingsApi {
  /**
   * Loads open security settings for unauthenticated management users.
   *
   * @returns OpenSecuritySettingsPayload on success, or an error result
   */
  getOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettingsPayload, AppError>>

  /**
   * Loads security configuration.
   *
   * @returns ManagementSecuritySettingsPayload on success, or an error result
   */
  getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>>

  /**
   * Pushes updated security settings to the server.
   *
   * @param request - Complete updated settings payload
   * @returns Updated ManagementSecuritySettingsPayload on success, or an error result
   */
  updateManagementSecuritySettings(
    request: ManagementSecuritySettingsPayload
  ): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>>

  /**
   * Resets security settings to defaults.
   *
   * @returns Fresh default ManagementSecuritySettingsPayload on success, or an error result
   */
  resetManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>>
}
