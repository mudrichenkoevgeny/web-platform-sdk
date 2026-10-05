import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '@/repository/globalsettings/ManagementGlobalSettingsRepository'

/** Returns cached global settings or fetches them from the server. */
export class GetManagementGlobalSettingsUseCase {
  /**
   * Constructs a new {@link GetManagementGlobalSettingsUseCase}.
   *
   * @param managementGlobalSettingsRepository - Management global settings repository
   */
  public constructor(private readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns ManagementGlobalSettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.managementGlobalSettingsRepository.getManagementGlobalSettings()
  }
}
