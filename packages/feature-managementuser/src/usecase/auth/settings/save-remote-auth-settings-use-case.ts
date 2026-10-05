import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/ManagementAuthSettingsRepository'

/** Pushes new auth settings to the remote server. */
export class SaveRemoteAuthSettingsUseCase {
  /**
   * Constructs a new {@link SaveRemoteAuthSettingsUseCase}.
   *
   * @param managementAuthSettingsRepository - Management auth settings repository
   */
  public constructor(private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @param authSettings - New configuration payload to apply
   * @returns Empty success indicator, or an error result
   */
  public async execute(authSettings: ManagementAuthSettings): Promise<AppResult<void, AppError>> {
    return this.managementAuthSettingsRepository.saveRemoteManagementAuthSettings(authSettings)
  }
}
