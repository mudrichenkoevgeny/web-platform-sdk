import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '../../repository/management/management-storage-settings-repository'

/** Forces a fresh fetch of management storage settings from server. */
export class RefreshManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link RefreshManagementStorageSettingsUseCase}.
   *
   * @param repository - Management storage settings repository
   */
  public constructor(protected readonly repository: ManagementStorageSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Fresh management storage settings domain model
   */
  public async execute(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.repository.refreshSettings()
  }
}
