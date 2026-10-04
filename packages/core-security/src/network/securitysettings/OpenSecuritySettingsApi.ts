import { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";

/**
 * Direct HTTP REST API client interface for fetching open security settings.
 */
export interface OpenSecuritySettingsApi {
  /**
   * Fetches active open security settings payload from the server.
   *
   * @returns AppResult containing {@link OpenSecuritySettingsPayload} on success or {@link AppError} on failure
   */
  getSecuritySettings(): Promise<AppResult<OpenSecuritySettingsPayload, AppError>>
}
