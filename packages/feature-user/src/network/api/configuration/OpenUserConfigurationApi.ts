import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Fetch combined user configuration bundle. */
export interface OpenUserConfigurationApi {
  /**
   * Loads the combined user configuration (global, security, auth settings).
   *
   * @returns AppResult with OpenUserConfigurationPayload or AppError
   */
  getOpenUserConfiguration(): Promise<AppResult<OpenUserConfigurationPayload, AppError>>
}
