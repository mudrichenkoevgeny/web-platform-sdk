import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsRepository } from '../../repository/open/open-storage-settings-repository'

/** Forces a fresh fetch of open storage settings from server. */
export class RefreshOpenStorageSettingsUseCase {
  /**
   * Constructs a new {@link RefreshOpenStorageSettingsUseCase}.
   *
   * @param repository - Open storage settings repository
   */
  public constructor(protected readonly repository: OpenStorageSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Fresh open storage settings domain model
   */
  public async execute(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.repository.refreshSettings()
  }
}
