import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Server-driven user configuration for the signed-in user. */
export interface ManagementUserConfigurationApi {
  /**
   * Loads the combined user configuration for management tasks.
   *
   * @returns Configuration DTO from the shared contract, or a mapped failure
   */
  getManagementUserConfiguration(): Promise<AppResult<ManagementUserConfigurationPayload, AppError>>
}
