import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

/** Updates security settings on the remote server and local state. */
export class UpdateManagementSecuritySettingsUseCase {
  /**
   * Constructs a new {@link UpdateManagementSecuritySettingsUseCase}.
   *
   * @param managementSecuritySettingsRepository - Management security settings repository
   */
  public constructor(private readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @param securitySettings - New security configuration payload to apply
   * @returns Empty success indicator or AppError
   */
  public async execute(securitySettings: ManagementSecuritySettings): Promise<AppResult<void, AppError>> {
    return this.managementSecuritySettingsRepository.saveRemoteManagementSecuritySettings(securitySettings)
  }
}
