import type { OpenStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * Direct HTTP REST API client interface for fetching open storage settings.
 */
export interface OpenStorageSettingsApi {
  /**
   * Fetches active open storage settings payload from the server.
   *
   * @returns AppResult containing {@link OpenStorageSettingsPayload} on success or {@link AppError} on failure
   */
  getOpenStorageSettings(): Promise<AppResult<OpenStorageSettingsPayload, AppError>>
}
