import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

/** Resets management security settings to default values remotely and updates local state. */
export class ResetRemoteSecuritySettingsUseCase {
  /**
   * Constructs a new {@link ResetRemoteSecuritySettingsUseCase}.
   *
   * @param managementSecuritySettingsRepository - Management security settings repository
   */
  public constructor(
    private readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @returns Default ManagementSecuritySettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.managementSecuritySettingsRepository.resetRemoteManagementSecuritySettings()
  }
}
