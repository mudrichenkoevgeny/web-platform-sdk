import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsRepository } from '@/repository/storage-settings/open-storage-settings-repository'

/** Use case retrieving cached or fresh open storage settings. */
export class GetOpenStorageSettingsUseCase {
  /**
   * Constructs a new {@link GetOpenStorageSettingsUseCase}.
   *
   * @param repository - Open storage settings repository
   */
  public constructor(private readonly repository: OpenStorageSettingsRepository) {}

  /**
   * Executes fetch operation for open storage settings.
   *
   * @returns AppResult containing OpenStorageSettings or AppError
   */
  public async execute(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.repository.getOpenStorageSettings()
  }
}
