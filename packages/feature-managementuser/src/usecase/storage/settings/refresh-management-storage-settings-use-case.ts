import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/storage/settings/management-storage-settings-repository'

/** Forces a network reload of management storage settings and updates local state. */
export class RefreshManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link RefreshManagementStorageSettingsUseCase}.
   *
   * @param managementStorageSettingsRepository - Management storage settings repository
   */
  public constructor(
    private readonly managementStorageSettingsRepository: ManagementStorageSettingsRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @returns Refreshed ManagementStorageSettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.managementStorageSettingsRepository.refreshManagementStorageSettings()
  }
}
