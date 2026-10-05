import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenGlobalSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { OpenSecuritySettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenUserConfigurationApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { toOpenUserConfiguration } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUserConfiguration } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Fetches the combined open user configuration bundle and, when the network call succeeds, writes each
 * slice into matching open repositories (global and security settings).
 */
export class RefreshManagementUserConfigurationUseCase {
  /**
   * Constructs a new {@link RefreshManagementUserConfigurationUseCase}.
   *
   * @param openUserConfigurationApi - Remote source for the bundled configuration DTO
   * @param openGlobalSettingsRepository - Persists open global settings from the bundle
   * @param openSecuritySettingsRepository - Persists open security settings from the bundle
   */
  public constructor(
    private readonly openUserConfigurationApi: OpenUserConfigurationApi,
    private readonly openGlobalSettingsRepository: OpenGlobalSettingsRepository,
    private readonly openSecuritySettingsRepository: OpenSecuritySettingsRepository
  ) {}

  /**
   * Executes the configuration refresh flow.
   *
   * @returns Mapped {@link OpenUserConfiguration} on success after repositories are updated; error on failure
   */
  public async execute(): Promise<AppResult<OpenUserConfiguration, AppError>> {
    const apiResult = await this.openUserConfigurationApi.getOpenUserConfiguration()
    const userConfigurationResult = mapSuccess(apiResult, (payload) => toOpenUserConfiguration(payload))

    if (isSuccess(userConfigurationResult)) {
      const userConfiguration = userConfigurationResult.data
      await this.openGlobalSettingsRepository.updateOpenGlobalSettings(userConfiguration.openGlobalSettings)
      await this.openSecuritySettingsRepository.updateOpenSecuritySettings(userConfiguration.openSecuritySettings)
    }

    return userConfigurationResult
  }
}
