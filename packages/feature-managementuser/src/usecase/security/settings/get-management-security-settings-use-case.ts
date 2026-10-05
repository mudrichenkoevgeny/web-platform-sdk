import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

/** Returns cached security settings or fetches them from the server. */
export class GetManagementSecuritySettingsUseCase {
  /**
   * Constructs a new {@link GetManagementSecuritySettingsUseCase}.
   *
   * @param managementSecuritySettingsRepository - Management security settings repository
   */
  public constructor(
    private readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @returns ManagementSecuritySettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.managementSecuritySettingsRepository.getManagementSecuritySettings()
  }
}
