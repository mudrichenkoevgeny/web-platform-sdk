import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/ManagementAuthSettingsRepository'

/** Returns cached management auth settings when already loaded or stored; otherwise loads from the network. */
export class GetManagementAuthSettingsUseCase {
  /**
   * Constructs a new {@link GetManagementAuthSettingsUseCase}.
   *
   * @param managementAuthSettingsRepository - Remote management auth settings repository
   */
  public constructor(private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns ManagementAuthSettings on success, or a mapped failure
   */
  public async execute(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.managementAuthSettingsRepository.getManagementAuthSettings()
  }
}
