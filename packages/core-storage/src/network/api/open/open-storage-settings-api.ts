import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Public REST API client contract for open storage settings domain.
 */
export interface OpenStorageSettingsApi {
  /**
   * Fetches public storage settings and maps response to domain model.
   *
   * @returns A promise resolving to an {@link AppResult} containing {@link OpenStorageSettings} or {@link AppError}
   */
  getSettings(): Promise<AppResult<OpenStorageSettings, AppError>>
}
