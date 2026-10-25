import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { toOpenGlobalSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { OpenGlobalSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { toOpenSecuritySettings } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenSecuritySettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenStorageSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'
import { toManagementAuthSettings, toOpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUserConfigurationApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { toOpenUserConfiguration } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUserConfiguration } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Fetches the combined open user configuration bundle and, when the network call succeeds, writes each
 * slice into matching open repositories (global, security, storage, and auth settings).
 */
export class RefreshManagementUserConfigurationUseCase {
  /**
   * Constructs a new {@link RefreshManagementUserConfigurationUseCase}.
   *
   * @param openUserConfigurationApi Remote source for the bundled configuration DTO
   * @param openGlobalSettingsRepository Persists open global settings from the bundle
   * @param openSecuritySettingsRepository Persists open security settings from the bundle
   * @param openStorageSettingsRepository Persists open storage settings from the bundle
   * @param managementAuthSettingsRepository Persists management auth settings from the bundle
   */
  public constructor(
    private readonly openUserConfigurationApi: OpenUserConfigurationApi,
    private readonly openGlobalSettingsRepository: OpenGlobalSettingsRepository,
    private readonly openSecuritySettingsRepository: OpenSecuritySettingsRepository,
    private readonly openStorageSettingsRepository: OpenStorageSettingsRepository,
    private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository
  ) {}

  /**
   * Executes the configuration refresh flow.
   *
   * @returns Mapped {@link OpenUserConfiguration} on success after repositories are updated; error on failure
   */
  public async execute(): Promise<AppResult<OpenUserConfiguration, AppError>> {
    const apiResult = await this.openUserConfigurationApi.getOpenUserConfiguration()

    if (isSuccess(apiResult)) {
      await this.openGlobalSettingsRepository.updateOpenGlobalSettings(toOpenGlobalSettings(apiResult.data.open_global_settings))
      await this.openSecuritySettingsRepository.updateOpenSecuritySettings(toOpenSecuritySettings(apiResult.data.open_security_settings))
      await this.openStorageSettingsRepository.updateOpenStorageSettings(toOpenStorageSettings(apiResult.data.open_storage_settings))
      await this.managementAuthSettingsRepository.updateManagementAuthSettings(toManagementAuthSettings(apiResult.data.management_auth_settings))
    }

    return mapSuccess(apiResult, (payload) => toOpenUserConfiguration(payload))
  }
}
