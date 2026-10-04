import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenGlobalSettings } from '@/domain/model/OpenGlobalSettings'
import { OpenGlobalSettingsRepository } from '@/repository/OpenGlobalSettingsRepository'

/**
 * Use case that delegates to {@link OpenGlobalSettingsRepository.refreshOpenGlobalSettings}.
 */
export class RefreshOpenGlobalSettingsUseCase {
  /**
   * Constructs a new {@link RefreshOpenGlobalSettingsUseCase}.
   *
   * @param openGlobalSettingsRepository - Repository performing network refresh and persistence
   */
  public constructor(
    private readonly openGlobalSettingsRepository: OpenGlobalSettingsRepository
  ) {}

  /**
   * Forces a refresh of open global settings from the network.
   *
   * @returns AppResult resolving to refreshed OpenGlobalSettings or AppError
   */
  public async execute(): Promise<AppResult<OpenGlobalSettings, AppError>> {
    return this.openGlobalSettingsRepository.refreshOpenGlobalSettings()
  }
}
