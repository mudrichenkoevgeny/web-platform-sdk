import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettingsPayload, OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementSecuritySettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsApi } from '@/network/api/security/settings/management-security-settings-api'

/** {@link ManagementSecuritySettingsApi} implementation backed by {@link HttpClient}. */
export class FetchManagementSecuritySettingsApi implements ManagementSecuritySettingsApi {
  /**
   * Constructs a new {@link FetchManagementSecuritySettingsApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<OpenSecuritySettingsPayload>(
        ManagementSecuritySettingsRoutes.GET_OPEN_SECURITY_SETTINGS
      )
    )
  }

  public async getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementSecuritySettingsPayload>(
        ManagementSecuritySettingsRoutes.GET_MANAGEMENT_SECURITY_SETTINGS
      )
    )
  }

  public async updateManagementSecuritySettings(
    request: ManagementSecuritySettingsPayload
  ): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementSecuritySettingsPayload>(
        ManagementSecuritySettingsRoutes.UPDATE_MANAGEMENT_SECURITY_SETTINGS,
        {
          method: 'PUT',
          body: JSON.stringify(request)
        }
      )
    )
  }

  public async resetManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementSecuritySettingsPayload>(
        ManagementSecuritySettingsRoutes.RESET_MANAGEMENT_SECURITY_SETTINGS,
        {
          method: 'POST'
        }
      )
    )
  }
}
