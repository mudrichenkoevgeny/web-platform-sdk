import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/ManagementAuthSettingsRepository'

/** Resets management authentication settings to default values remotely and updates local state. */
export class ResetRemoteAuthSettingsUseCase {
  /**
   * Constructs a new {@link ResetRemoteAuthSettingsUseCase}.
   *
   * @param managementAuthSettingsRepository - Management auth settings repository
   */
  public constructor(private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Default ManagementAuthSettings on success, or an error result
   */
  public async execute(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.managementAuthSettingsRepository.resetRemoteManagementAuthSettings()
  }
}
