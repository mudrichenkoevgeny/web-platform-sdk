import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenGlobalSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { OpenSecuritySettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenStorageSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'
import {
  toManagementGlobalSettings,
  toManagementSecuritySettings,
  toManagementStorageSettings,
  toManagementAuthSettings,
  toManagementUserConfiguration
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserConfigurationApi } from '@/network/api/configuration/management-user-configuration-api'
import type { ManagementUserConfiguration } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Fetches the combined management user configuration bundle and, when the network call succeeds, writes each
 * slice into matching repositories (global, security, storage, and auth settings).
 */
export class RefreshManagementUserConfigurationUseCase {
  /**
   * Constructs a new {@link RefreshManagementUserConfigurationUseCase}.
   *
   * @param managementUserConfigurationApi Remote source for the bundled configuration DTO
   * @param openGlobalSettingsRepository Persists open global settings from the bundle
   * @param openSecuritySettingsRepository Persists open security settings from the bundle
   * @param openStorageSettingsRepository Persists open storage settings from the bundle
   * @param managementAuthSettingsRepository Persists management auth settings from the bundle
   */
  public constructor(
    private readonly managementUserConfigurationApi: ManagementUserConfigurationApi,
    private readonly openGlobalSettingsRepository: OpenGlobalSettingsRepository,
    private readonly openSecuritySettingsRepository: OpenSecuritySettingsRepository,
    private readonly openStorageSettingsRepository: OpenStorageSettingsRepository,
    private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository
  ) {}

  /**
   * Executes the configuration refresh flow.
   *
   * @returns Mapped {@link ManagementUserConfiguration} on success after repositories are updated; error on failure
   */
  public async execute(): Promise<AppResult<ManagementUserConfiguration, AppError>> {
    const apiResult = await this.managementUserConfigurationApi.getManagementUserConfiguration()

    if (isSuccess(apiResult)) {
      await this.openGlobalSettingsRepository.updateOpenGlobalSettings(
        toManagementGlobalSettings(apiResult.data.management_global_settings)
      )
      await this.openSecuritySettingsRepository.updateOpenSecuritySettings(
        toManagementSecuritySettings(apiResult.data.management_security_settings)
      )
      await this.openStorageSettingsRepository.updateOpenStorageSettings(
        toManagementStorageSettings(apiResult.data.management_storage_settings)
      )
      await this.managementAuthSettingsRepository.updateManagementAuthSettings(
        toManagementAuthSettings(apiResult.data.management_auth_settings)
      )
    }

    return mapSuccess(apiResult, (payload) => toManagementUserConfiguration(payload))
  }
}
