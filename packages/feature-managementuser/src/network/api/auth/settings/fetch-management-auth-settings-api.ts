import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAuthSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsApi } from '@/network/api/auth/settings/management-auth-settings-api'

/** {@link ManagementAuthSettingsApi} implementation backed by {@link HttpClient}. */
export class FetchManagementAuthSettingsApi implements ManagementAuthSettingsApi {
  /**
   * Constructs a new {@link FetchManagementAuthSettingsApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getManagementAuthSettings(): Promise<AppResult<ManagementAuthSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementAuthSettingsPayload>(ManagementAuthSettingsRoutes.GET_MANAGEMENT_AUTH_SETTINGS)
    )
  }

  public async updateManagementAuthSettings(
    request: ManagementAuthSettingsPayload
  ): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(ManagementAuthSettingsRoutes.UPDATE_MANAGEMENT_AUTH_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify(request)
      })
    )
  }

  public async resetManagementAuthSettings(): Promise<AppResult<ManagementAuthSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementAuthSettingsPayload>(
        ManagementAuthSettingsRoutes.RESET_MANAGEMENT_AUTH_SETTINGS,
        {
          method: 'POST'
        }
      )
    )
  }
}
