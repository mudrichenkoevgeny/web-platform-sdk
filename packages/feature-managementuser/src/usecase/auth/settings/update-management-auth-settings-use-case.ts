import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'

/**
 * Pushes updated management auth settings to the remote server via {@link ManagementAuthSettingsRepository}.
 */
export class UpdateManagementAuthSettingsUseCase {
  /**
   * Constructs a new {@link UpdateManagementAuthSettingsUseCase}.
   *
   * @param managementAuthSettingsRepository - Repository instance
   */
  public constructor(private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository) {}

  /**
   * Pushes updated auth settings and updates local storage and observers on success.
   *
   * @param authSettings - New settings to apply
   * @returns AppResult containing updated ManagementAuthSettings on success, or an AppError
   */
  public async execute(authSettings: ManagementAuthSettings): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.managementAuthSettingsRepository.saveRemoteManagementAuthSettings(authSettings)
  }
}
