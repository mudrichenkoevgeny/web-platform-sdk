import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsRepository } from '@/repository/storage-settings/open-storage-settings-repository'

/** Use case forcing remote network fetch for open storage settings. */
export class RefreshOpenStorageSettingsUseCase {
  /**
   * Constructs a new {@link RefreshOpenStorageSettingsUseCase}.
   *
   * @param repository - Open storage settings repository
   */
  public constructor(private readonly repository: OpenStorageSettingsRepository) {}

  /**
   * Forces a network refresh of open storage settings.
   *
   * @returns AppResult containing updated OpenStorageSettings or AppError
   */
  public async execute(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.repository.refreshOpenStorageSettings()
  }
}
