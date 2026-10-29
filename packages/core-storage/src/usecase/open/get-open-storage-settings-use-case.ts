import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsRepository } from '../../repository/open/open-storage-settings-repository'

/** Retrieves open storage settings. */
export class GetOpenStorageSettingsUseCase {
  /**
   * Constructs a new {@link GetOpenStorageSettingsUseCase}.
   *
   * @param repository - Open storage settings repository
   */
  public constructor(protected readonly repository: OpenStorageSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Open storage settings domain model
   */
  public async execute(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.repository.getSettings()
  }
}
