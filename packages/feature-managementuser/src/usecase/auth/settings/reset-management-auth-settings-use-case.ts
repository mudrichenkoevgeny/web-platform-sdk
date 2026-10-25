import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'

/** Resets management auth settings to default values remotely and updates local state. */
export class ResetManagementAuthSettingsUseCase {
  /**
   * Constructs a new {@link ResetManagementAuthSettingsUseCase}.
   *
   * @param managementAuthSettingsRepository - Management auth settings repository
   */
  public constructor(private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Default ManagementAuthSettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.managementAuthSettingsRepository.resetRemoteManagementAuthSettings()
  }
}
