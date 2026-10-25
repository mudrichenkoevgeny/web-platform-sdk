import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/storage/settings/management-storage-settings-repository'

/** Resets management storage settings to default values remotely and updates local state. */
export class ResetManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link ResetManagementStorageSettingsUseCase}.
   *
   * @param managementStorageSettingsRepository - Management storage settings repository
   */
  public constructor(
    private readonly managementStorageSettingsRepository: ManagementStorageSettingsRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @returns Default ManagementStorageSettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.managementStorageSettingsRepository.resetRemoteManagementStorageSettings()
  }
}
