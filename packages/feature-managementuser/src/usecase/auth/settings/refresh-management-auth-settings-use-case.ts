import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'

/** Forces a network reload of auth-related settings and updates the repository's observable state. */
export class RefreshManagementAuthSettingsUseCase {
  /**
   * Constructs a new {@link RefreshManagementAuthSettingsUseCase}.
   *
   * @param managementAuthSettingsRepository - Management auth settings repository
   */
  public constructor(private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Fresh ManagementAuthSettings on success, or an error result
   */
  public async execute(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.managementAuthSettingsRepository.refreshManagementAuthSettings()
  }
}
