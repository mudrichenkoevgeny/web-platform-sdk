import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementStorageSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsApi } from '@/network/api/storage/settings/management-storage-settings-api'

/** {@link ManagementStorageSettingsApi} implementation backed by {@link HttpClient}. */
export class FetchManagementStorageSettingsApi implements ManagementStorageSettingsApi {
  /**
   * Constructs a new {@link FetchManagementStorageSettingsApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Retrieves the platform-wide storage settings.
   *
   * @returns A promise resolving to an {@link AppResult} containing {@link ManagementStorageSettingsPayload} or {@link AppError}
   */
  public async getManagementStorageSettings(): Promise<AppResult<ManagementStorageSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementStorageSettingsPayload>(
        ManagementStorageSettingsRoutes.GET_MANAGEMENT_STORAGE_SETTINGS
      )
    )
  }

  /**
   * Updates global storage settings and category upload limits.
   *
   * @param settings - The updated settings payload to apply
   * @returns A promise resolving to an {@link AppResult} containing updated {@link ManagementStorageSettingsPayload} or {@link AppError}
   */
  public async updateManagementStorageSettings(
    request: ManagementStorageSettingsPayload
  ): Promise<AppResult<ManagementStorageSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementStorageSettingsPayload>(
        ManagementStorageSettingsRoutes.UPDATE_MANAGEMENT_STORAGE_SETTINGS,
        {
          method: 'PUT',
          body: JSON.stringify(request)
        }
      )
    )
  }

  /**
   * Resets global storage settings and category limits to default platform values.
   *
   * @returns A promise resolving to an {@link AppResult} containing default {@link ManagementStorageSettingsPayload} or {@link AppError}
   */
  public async resetManagementStorageSettings(): Promise<AppResult<ManagementStorageSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementStorageSettingsPayload>(
        ManagementStorageSettingsRoutes.RESET_MANAGEMENT_STORAGE_SETTINGS,
        {
          method: 'POST'
        }
      )
    )
  }
}
