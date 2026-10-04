import { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettings } from '@/domain/model/OpenGlobalSettings'
import { OpenGlobalSettingsRepository } from '@/repository/OpenGlobalSettingsRepository'

/**
 * Use case that delegates to {@link OpenGlobalSettingsRepository.getOpenGlobalSettings}.
 */
export class GetOpenGlobalSettingsUseCase {
  /**
   * Constructs a new {@link GetOpenGlobalSettingsUseCase}.
   *
   * @param openGlobalSettingsRepository - Source of truth for cached or network-backed settings
   */
  public constructor(
    private readonly openGlobalSettingsRepository: OpenGlobalSettingsRepository
  ) {}

  /**
   * Retrieves the current open global settings.
   *
   * @returns AppResult resolving to OpenGlobalSettings or AppError
   */
  public async execute(): Promise<AppResult<OpenGlobalSettings, AppError>> {
    return this.openGlobalSettingsRepository.getOpenGlobalSettings()
  }
}
