import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/storage/settings/management-storage-settings-repository'

/**
 * Pushes updated storage settings to the remote server via {@link ManagementStorageSettingsRepository}.
 */
export class UpdateManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link UpdateManagementStorageSettingsUseCase}.
   *
   * @param managementStorageSettingsRepository - Repository instance
   */
  public constructor(
    private readonly managementStorageSettingsRepository: ManagementStorageSettingsRepository
  ) {}

  /**
   * Pushes updated storage settings and updates local storage on success.
   *
   * @param storageSettings - New settings to apply
   * @returns AppResult containing updated ManagementStorageSettings on success, or an AppError
   */
  public async execute(
    storageSettings: ManagementStorageSettings
  ): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.managementStorageSettingsRepository.saveRemoteManagementStorageSettings(storageSettings)
  }
}
