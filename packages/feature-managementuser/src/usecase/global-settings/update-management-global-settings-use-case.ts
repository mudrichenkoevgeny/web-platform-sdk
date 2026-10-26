import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '@/repository/global-settings/management-global-settings-repository'

/**
 * Pushes updated global application settings to the remote server via {@link ManagementGlobalSettingsRepository}.
 */
export class UpdateManagementGlobalSettingsUseCase {
  /**
   * Constructs a new {@link UpdateManagementGlobalSettingsUseCase}.
   *
   * @param managementGlobalSettingsRepository - Repository instance
   */
  public constructor(
    private readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository
  ) {}

  /**
   * Pushes updated global settings and updates local storage on success.
   *
   * @param globalSettings - New settings to apply
   * @returns AppResult containing updated ManagementGlobalSettings on success, or an AppError
   */
  public async execute(
    globalSettings: ManagementGlobalSettings
  ): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.managementGlobalSettingsRepository.saveRemoteManagementGlobalSettings(globalSettings)
  }
}
