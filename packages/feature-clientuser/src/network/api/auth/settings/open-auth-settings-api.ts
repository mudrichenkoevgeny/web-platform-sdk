import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch current authentication settings for open flows. */
export interface OpenAuthSettingsApi {
  /**
   * Loads auth-related settings for the current session (providers, policies, etc.).
   *
   * @returns Settings DTO from the shared contract, or a mapped failure
   */
  getAuthSettings(): Promise<AppResult<OpenAuthSettingsPayload, AppError>>
}
