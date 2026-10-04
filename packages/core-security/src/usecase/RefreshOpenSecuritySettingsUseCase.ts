import { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenSecuritySettings } from '@/domain/model/OpenSecuritySettings'
import { OpenSecuritySettingsRepository } from '@/repository/OpenSecuritySettingsRepository'

/**
 * Use case that delegates to {@link OpenSecuritySettingsRepository.refreshOpenSecuritySettings}.
 */
export class RefreshOpenSecuritySettingsUseCase {
  /**
   * Constructs a new {@link RefreshOpenSecuritySettingsUseCase}.
   *
   * @param openSecuritySettingsRepository - Repository performing the network refresh and persistence
   */
  public constructor(
    private readonly openSecuritySettingsRepository: OpenSecuritySettingsRepository
  ) {}

  /**
   * Executes the refresh operation.
   *
   * @returns Promise resolving to AppResult with refreshed settings or error
   */
  public async execute(): Promise<AppResult<OpenSecuritySettings, AppError>> {
    return this.openSecuritySettingsRepository.refreshOpenSecuritySettings()
  }
}
