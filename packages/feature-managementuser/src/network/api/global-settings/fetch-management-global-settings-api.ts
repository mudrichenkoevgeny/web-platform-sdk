import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGlobalSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsApi } from '@/network/api/global-settings/management-global-settings-api'

/** {@link ManagementGlobalSettingsApi} implementation backed by {@link HttpClient}. */
export class FetchManagementGlobalSettingsApi implements ManagementGlobalSettingsApi {
  /**
   * Constructs a new {@link FetchManagementGlobalSettingsApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Retrieves global platform settings for management.
   *
   * @returns AppResult containing {@link ManagementGlobalSettingsPayload} on success or {@link AppError} on failure
   */
  public async getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementGlobalSettingsPayload>(
        ManagementGlobalSettingsRoutes.GET_MANAGEMENT_GLOBAL_SETTINGS
      )
    )
  }

  /**
   * Updates platform-wide global settings via HTTP PUT request.
   *
   * @param request - New global settings payload
   * @returns AppResult resolving to void on success or {@link AppError} on failure
   */
  public async updateManagementGlobalSettings(
    request: ManagementGlobalSettingsPayload
  ): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementGlobalSettingsPayload>(
        ManagementGlobalSettingsRoutes.UPDATE_MANAGEMENT_GLOBAL_SETTINGS,
        {
          method: 'PUT',
          body: JSON.stringify(request)
        }
      )
    )
  }

  /**
   * Resets platform-wide global settings to default values via HTTP POST request.
   *
   * @returns AppResult containing fresh default {@link ManagementGlobalSettingsPayload} on success or {@link AppError} on failure
   */
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
