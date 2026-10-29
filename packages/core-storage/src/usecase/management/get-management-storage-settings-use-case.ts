import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '../../repository/management/management-storage-settings-repository'

/** Retrieves management storage settings. */
export class GetManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link GetManagementStorageSettingsUseCase}.
   *
   * @param repository - Management storage settings repository
   */
  public constructor(protected readonly repository: ManagementStorageSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Management storage settings domain model
   */
  public async execute(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.repository.getSettings()
  }
}
