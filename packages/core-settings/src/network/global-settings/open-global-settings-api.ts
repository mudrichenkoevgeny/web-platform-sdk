import { OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";

/**
 * Direct HTTP REST API client interface for fetching open global platform settings.
 */
export interface OpenGlobalSettingsApi {
  /**
   * Fetches active open global settings payload from the server.
   *
   * @returns AppResult containing {@link OpenGlobalSettingsPayload} on success or {@link AppError} on failure
   */
  getOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettingsPayload, AppError>>
}
