import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '@/repository/globalsettings/ManagementGlobalSettingsRepository'

/** Resets management global settings to default values remotely and updates local state. */
export class ResetRemoteGlobalSettingsUseCase {
  /**
   * Constructs a new {@link ResetRemoteGlobalSettingsUseCase}.
   *
   * @param managementGlobalSettingsRepository - Management global settings repository
   */
  public constructor(private readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Default ManagementGlobalSettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.managementGlobalSettingsRepository.resetRemoteManagementGlobalSettings()
  }
}
