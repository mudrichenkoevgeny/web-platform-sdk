import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'

/** Updates auth settings on the remote server and local state. */
export class UpdateManagementAuthSettingsUseCase {
  /**
   * Constructs a new {@link UpdateManagementAuthSettingsUseCase}.
   *
   * @param managementAuthSettingsRepository - Management auth settings repository
   */
  public constructor(private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @param authSettings - New auth configuration payload to apply
   * @returns Empty success indicator or AppError
   */
  public async execute(authSettings: ManagementAuthSettings): Promise<AppResult<void, AppError>> {
    return this.managementAuthSettingsRepository.saveRemoteManagementAuthSettings(authSettings)
  }
}
