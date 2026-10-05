import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenGlobalSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { OpenSecuritySettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenAuthSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUserConfigurationApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  toOpenUserConfiguration
} from '@/domain/model/configuration/open-user-configuration'
import type { OpenUserConfiguration } from '@/domain/model/configuration/open-user-configuration'

/**
 * Fetches the combined user configuration bundle and, when the network call succeeds, writes each
 * slice into the matching core repositories (global, security, and auth settings).
 */
export class RefreshClientUserConfigurationUseCase {
  /**
   * Constructs a new {@link RefreshClientUserConfigurationUseCase}.
   *
   * @param openUserConfigurationApi - Remote source for the bundled configuration DTO
   * @param openGlobalSettingsRepository - Persists global settings from the bundle
   * @param openSecuritySettingsRepository - Persists security settings from the bundle
   * @param openAuthSettingsRepository - Persists auth settings from the bundle
   */
  public constructor(
    private readonly openUserConfigurationApi: OpenUserConfigurationApi,
    private readonly openGlobalSettingsRepository: OpenGlobalSettingsRepository,
    private readonly openSecuritySettingsRepository: OpenSecuritySettingsRepository,
    private readonly openAuthSettingsRepository: OpenAuthSettingsRepository
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
      await this.openAuthSettingsRepository.updateOpenAuthSettings(userConfiguration.openAuthSettings)
    }

    return userConfigurationResult
  }
}
