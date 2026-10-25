import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsRepository } from '@/repository/storage-settings/open-storage-settings-repository'

/**
 * Use case that delegates to {@link OpenStorageSettingsRepository.getOpenStorageSettings}.
 */
export class GetOpenStorageSettingsUseCase {
  /**
   * Constructs a new {@link GetOpenStorageSettingsUseCase}.
   *
   * @param openStorageSettingsRepository - Source of truth for cached or network-backed settings
   */
  public constructor(
    private readonly openStorageSettingsRepository: OpenStorageSettingsRepository
  ) {}

  /**
   * Retrieves the current open storage settings.
   *
   * @returns AppResult resolving to OpenStorageSettings or AppError
   */
  public async execute(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.openStorageSettingsRepository.getOpenStorageSettings()
  }
}
