import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenAuthSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Forces a network reload of auth-related settings and updates the repository's observable state.
 */
export class RefreshOpenAuthSettingsUseCase {
  /**
   * Constructs a new {@link RefreshOpenAuthSettingsUseCase}.
   *
   * @param openAuthSettingsRepository - Auth settings aggregate repository
   */
  public constructor(private readonly openAuthSettingsRepository: OpenAuthSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @returns Fresh {@link OpenAuthSettings} on success, or an error result when the refresh request fails
   */
  public async execute(): Promise<AppResult<OpenAuthSettings, AppError>> {
    return this.openAuthSettingsRepository.refreshOpenAuthSettings()
  }
}
