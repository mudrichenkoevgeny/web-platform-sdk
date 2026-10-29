import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Request payload DTO for updating management storage settings. */
export type UpdateManagementStorageSettingsRequest = Partial<ManagementStorageSettings>

/**
 * Management REST API client contract for storage settings domain.
 */
export interface ManagementStorageSettingsApi {
  /**
   * Fetches current management storage settings and maps payload to domain model.
   *
   * @returns AppResult containing {@link ManagementStorageSettings} on success
   */
  getSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Updates management storage settings using request payload DTO.
   *
   * @param request - DTO containing updated settings properties
   * @returns AppResult containing updated {@link ManagementStorageSettings}
   */
  updateSettings(
    request: UpdateManagementStorageSettingsRequest
  ): Promise<AppResult<ManagementStorageSettings, AppError>>

  /**
   * Resets management storage settings to default values.
   *
   * @returns AppResult containing default {@link ManagementStorageSettings}
   */
  resetSettings(): Promise<AppResult<ManagementStorageSettings, AppError>>
}
