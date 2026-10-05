import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

/** Pushes updated security settings to the remote server. */
export class SaveRemoteSecuritySettingsUseCase {
  /**
   * Constructs a new {@link SaveRemoteSecuritySettingsUseCase}.
   *
   * @param managementSecuritySettingsRepository - Management security settings repository
   */
  public constructor(
    private readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @param securitySettings - Updated security configuration payload
   * @returns Void result or AppError
   */
  public async execute(securitySettings: ManagementSecuritySettings): Promise<AppResult<void, AppError>> {
    return this.managementSecuritySettingsRepository.saveRemoteManagementSecuritySettings(securitySettings)
  }
}
