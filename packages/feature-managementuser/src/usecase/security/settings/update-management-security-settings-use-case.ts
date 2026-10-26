import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

/**
 * Pushes updated security settings to the remote server via {@link ManagementSecuritySettingsRepository}.
 */
export class UpdateManagementSecuritySettingsUseCase {
  /**
   * Constructs a new {@link UpdateManagementSecuritySettingsUseCase}.
   *
   * @param managementSecuritySettingsRepository - Repository instance
   */
  public constructor(
    private readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository
  ) {}

  /**
   * Pushes updated security settings and updates local storage on success.
   *
   * @param securitySettings - New settings to apply
   * @returns AppResult containing updated ManagementSecuritySettings on success, or an AppError
   */
  public async execute(
    securitySettings: ManagementSecuritySettings
  ): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.managementSecuritySettingsRepository.saveRemoteManagementSecuritySettings(securitySettings)
  }
}
