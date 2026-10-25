import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/storage/settings/management-storage-settings-repository'

/** Returns cached management storage settings or fetches them from the server. */
export class GetManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link GetManagementStorageSettingsUseCase}.
   *
   * @param managementStorageSettingsRepository - Management storage settings repository
   */
  public constructor(
    private readonly managementStorageSettingsRepository: ManagementStorageSettingsRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @returns ManagementStorageSettings on success or AppError
   */
  public async execute(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.managementStorageSettingsRepository.getManagementStorageSettings()
  }
}
