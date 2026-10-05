import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

/** Forces a network reload of security settings. */
export class RefreshManagementSecuritySettingsUseCase {
  /**
   * Constructs a new {@link RefreshManagementSecuritySettingsUseCase}.
   *
   * @param managementSecuritySettingsRepository - Management security settings repository
   */
  public constructor(
    private readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @returns Fresh ManagementSecuritySettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.managementSecuritySettingsRepository.refreshManagementSecuritySettings()
  }
}
