import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Management Storage Settings API contract for staff administrative operations.
 */
export interface ManagementStorageSettingsApi {
  /**
   * Retrieves the platform-wide storage settings.
   *
   * @returns A promise resolving to an {@link AppResult} containing {@link ManagementStorageSettingsPayload} or {@link AppError}
   */
  getManagementStorageSettings(): Promise<AppResult<ManagementStorageSettingsPayload, AppError>>

  /**
   * Updates global storage settings and category upload limits.
   *
   * @param settings - The updated settings payload to apply
   * @returns A promise resolving to an {@link AppResult} containing updated {@link ManagementStorageSettingsPayload} or {@link AppError}
   */
  updateManagementStorageSettings(
    settings: ManagementStorageSettingsPayload
  ): Promise<AppResult<ManagementStorageSettingsPayload, AppError>>

  /**
   * Resets global storage settings and category limits to default platform values.
   *
   * @returns A promise resolving to an {@link AppResult} containing default {@link ManagementStorageSettingsPayload} or {@link AppError}
   */
  resetManagementStorageSettings(): Promise<AppResult<ManagementStorageSettingsPayload, AppError>>
}
