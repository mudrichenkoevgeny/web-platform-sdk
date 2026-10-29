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
  managementStorageSettingsPayloadSchema,
  toManagementStorageSettings,
  toManagementStorageSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  ManagementStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  ManagementStorageSettingsApi,
  UpdateManagementStorageSettingsRequest
} from './management-storage-settings-api'

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
   * Fetches current management storage settings and maps payload to domain model.
   *
   * @returns AppResult containing {@link ManagementStorageSettings} on success
   */
  public async getSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return callResult(async () => {
      const response = await this.client.request<unknown>(
        ManagementStorageSettingsRoutes.GET_MANAGEMENT_STORAGE_SETTINGS
      )
      const payload = managementStorageSettingsPayloadSchema.parse(response)
      return toManagementStorageSettings(payload)
    })
  }

  /**
   * Updates management storage settings using request payload DTO.
   *
   * @param request - DTO containing updated settings properties
   * @returns AppResult containing updated {@link ManagementStorageSettings}
   */
  public async updateSettings(
    request: UpdateManagementStorageSettingsRequest
  ): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return callResult(async () => {
      const currentResult = await this.getSettings()
      const currentSettings = currentResult.success
        ? currentResult.data
        : {
            minUploadSizeBytes: 1024,
            maxUploadSizeBytes: 104857600,
            totalStorageQuotaForOpenUserBytes: null,
            totalStorageQuotaForManagementUserBytes: null,
            presignedUrlExpirationSeconds: 3600,
            maxPendingUploadsForOpenUser: 10,
            maxPendingUploadsForManagementUser: 100,
            isDeduplicationEnabled: true,
            deletedFilesCleanupIntervalSeconds: 86400
          }
      const updatedDomain: ManagementStorageSettings = {
        ...currentSettings,
        ...request
      }
      const payload = toManagementStorageSettingsPayload(updatedDomain)
      const response = await this.client.request<unknown>(
        ManagementStorageSettingsRoutes.UPDATE_MANAGEMENT_STORAGE_SETTINGS,
        {
          method: 'PATCH',
          body: JSON.stringify(payload)
        }
      )
      const updatedPayload = managementStorageSettingsPayloadSchema.parse(response)
      return toManagementStorageSettings(updatedPayload)
    })
  }

  /**
   * Resets management storage settings to default values.
   *
   * @returns AppResult containing default {@link ManagementStorageSettings}
   */
  public async resetSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return callResult(async () => {
      const response = await this.client.request<unknown>(
        ManagementStorageSettingsRoutes.RESET_MANAGEMENT_STORAGE_SETTINGS,
        {
          method: 'POST'
        }
      )
      const payload = managementStorageSettingsPayloadSchema.parse(response)
      return toManagementStorageSettings(payload)
    })
  }
}
