import type { AppError, AppResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { callResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  OpenStorageSettingsRoutes,
  openStorageSettingsPayloadSchema,
  toOpenStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsApi } from './open-storage-settings-api'

/**
 * Fetch-based REST API client implementation of {@link OpenStorageSettingsApi}.
 */
export class FetchOpenStorageSettingsApi implements OpenStorageSettingsApi {
  /**
   * Constructs a new {@link FetchOpenStorageSettingsApi}.
   *
   * @param client - Pre-configured HTTP client instance
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Fetches public storage settings and maps response to domain model.
   *
   * @returns A promise resolving to an {@link AppResult} containing {@link OpenStorageSettings} or {@link AppError}
   */
  public async getSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return callResult(async () => {
      const response = await this.client.request<unknown>(
        OpenStorageSettingsRoutes.GET_OPEN_STORAGE_SETTINGS
      )
      const payload = openStorageSettingsPayloadSchema.parse(response)
      return toOpenStorageSettings(payload)
    })
  }
}
