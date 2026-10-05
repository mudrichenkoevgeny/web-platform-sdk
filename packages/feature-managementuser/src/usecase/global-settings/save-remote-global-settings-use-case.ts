import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '@/repository/globalsettings/ManagementGlobalSettingsRepository'

/** Pushes updated global settings to the remote server. */
export class SaveRemoteGlobalSettingsUseCase {
  /**
   * Constructs a new {@link SaveRemoteGlobalSettingsUseCase}.
   *
   * @param managementGlobalSettingsRepository - Management global settings repository
   */
  public constructor(private readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @param globalSettings - New global configuration payload to apply
   * @returns Empty success indicator or AppError
   */
  public async execute(globalSettings: ManagementGlobalSettings): Promise<AppResult<void, AppError>> {
    return this.managementGlobalSettingsRepository.saveRemoteManagementGlobalSettings(globalSettings)
  }
}
