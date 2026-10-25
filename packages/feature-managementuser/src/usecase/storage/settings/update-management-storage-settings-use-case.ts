import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/storage/settings/management-storage-settings-repository'

/** Updates management storage settings on the remote server and local state. */
export class UpdateManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link UpdateManagementStorageSettingsUseCase}.
   *
   * @param managementStorageSettingsRepository - Management storage settings repository
   */
  public constructor(
    private readonly managementStorageSettingsRepository: ManagementStorageSettingsRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @param storageSettings - New storage configuration payload to apply
   * @returns Empty success indicator or AppError
   */
  public async execute(storageSettings: ManagementStorageSettings): Promise<AppResult<void, AppError>> {
    return this.managementStorageSettingsRepository.saveRemoteManagementStorageSettings(storageSettings)
  }
}
