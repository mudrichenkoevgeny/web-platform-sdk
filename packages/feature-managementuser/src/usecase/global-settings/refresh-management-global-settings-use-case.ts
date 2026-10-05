import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '@/repository/globalsettings/ManagementGlobalSettingsRepository'

/** Forces a network reload of global settings. */
export class RefreshManagementGlobalSettingsUseCase {
  /**
   * Constructs a new {@link RefreshManagementGlobalSettingsUseCase}.
   *
   * @param managementGlobalSettingsRepository - Management global settings repository
   */
  public constructor(private readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Fresh ManagementGlobalSettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.managementGlobalSettingsRepository.refreshManagementGlobalSettings()
  }
}
