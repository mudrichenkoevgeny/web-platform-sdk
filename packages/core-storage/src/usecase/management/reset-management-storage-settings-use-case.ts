import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '../../repository/management/management-storage-settings-repository'

/** Resets management storage settings to default values. */
export class ResetManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link ResetManagementStorageSettingsUseCase}.
   *
   * @param repository - Management storage settings repository
   */
  public constructor(protected readonly repository: ManagementStorageSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Default management storage settings domain model
   */
  public async execute(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.repository.resetSettings()
  }
}
