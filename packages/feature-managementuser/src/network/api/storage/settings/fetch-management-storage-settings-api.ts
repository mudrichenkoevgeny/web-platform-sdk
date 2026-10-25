import {
  callResult
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  HttpClient,
  AppResult,
  AppError
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  ManagementStorageSettingsRoutes,
  type ManagementStorageSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsApi } from './management-storage-settings-api'

/**
 * Fetch-based implementation of {@link ManagementStorageSettingsApi}.
 */
export class FetchManagementStorageSettingsApi implements ManagementStorageSettingsApi {
  /**
   * Constructs a new {@link FetchManagementStorageSettingsApi} instance.
   *
   * @param client - The HTTP client instance used to execute network requests
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
    settings: ManagementStorageSettingsPayload
  ): Promise<AppResult<ManagementStorageSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementStorageSettingsPayload>(
        ManagementStorageSettingsRoutes.UPDATE_MANAGEMENT_STORAGE_SETTINGS,
        {
          method: 'PUT',
          body: JSON.stringify(settings)
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
