import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenAuthSettingsRepository } from '@/repository/auth/settings/OpenAuthSettingsRepository'
import { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Returns cached public auth settings when loaded/stored; otherwise initiates network load.
 */
export class GetAuthSettingsUseCase {
  /**
   * Constructs a new {@link GetAuthSettingsUseCase}.
   *
   * @param openAuthSettingsRepository - Remote auth settings repository
   */
  public constructor(private readonly openAuthSettingsRepository: OpenAuthSettingsRepository) {}

  /**
   * Invokes the use case.
   *
   * @returns OpenAuthSettings on success or AppError
   */
  public async execute(): Promise<AppResult<OpenAuthSettings, AppError>> {
    return this.openAuthSettingsRepository.getOpenAuthSettings()
  }
}
