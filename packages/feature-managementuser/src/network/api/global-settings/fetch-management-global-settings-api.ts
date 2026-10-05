import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGlobalSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsApi } from '@/network/api/globalsettings/ManagementGlobalSettingsApi'

/** {@link ManagementGlobalSettingsApi} implementation backed by {@link HttpClient}. */
export class FetchManagementGlobalSettingsApi implements ManagementGlobalSettingsApi {
  /**
   * Constructs a new {@link FetchManagementGlobalSettingsApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementGlobalSettingsPayload>(
        ManagementGlobalSettingsRoutes.GET_MANAGEMENT_GLOBAL_SETTINGS
      )
    )
  }

  public async updateManagementGlobalSettings(
    request: ManagementGlobalSettingsPayload
  ): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(ManagementGlobalSettingsRoutes.UPDATE_MANAGEMENT_GLOBAL_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify(request)
      })
    )
  }

  public async resetManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementGlobalSettingsPayload>(
        ManagementGlobalSettingsRoutes.RESET_MANAGEMENT_GLOBAL_SETTINGS,
        {
          method: 'POST'
        }
      )
    )
  }
}
