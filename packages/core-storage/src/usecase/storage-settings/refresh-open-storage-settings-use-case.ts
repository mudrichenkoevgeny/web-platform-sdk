import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsRepository } from '@/repository/storage-settings/open-storage-settings-repository'

/**
 * Use case that delegates to {@link OpenStorageSettingsRepository.refreshOpenStorageSettings}.
 */
export class RefreshOpenStorageSettingsUseCase {
  /**
   * Constructs a new {@link RefreshOpenStorageSettingsUseCase}.
   *
   * @param openStorageSettingsRepository - Repository performing network refresh and persistence
   */
  public constructor(
    private readonly openStorageSettingsRepository: OpenStorageSettingsRepository
  ) {}

  /**
   * Forces a refresh of open storage settings from the network.
   *
   * @returns AppResult resolving to refreshed OpenStorageSettings or AppError
   */
  public async execute(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.openStorageSettingsRepository.refreshOpenStorageSettings()
  }
}
