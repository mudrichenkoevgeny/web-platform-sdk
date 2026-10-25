import { OpenStorageSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { callResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { HttpClient, AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsApi } from './open-storage-settings-api'

/**
 * Fetch HTTP client implementation of {@link OpenStorageSettingsApi}.
 */
export class FetchOpenStorageSettingsApi implements OpenStorageSettingsApi {
  /**
   * Constructs a new {@link FetchOpenStorageSettingsApi}.
   *
   * @param httpClient - Configured SDK HTTP client instance
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Executes HTTP GET request to retrieve open storage settings payload.
   *
   * @returns AppResult wrapping {@link OpenStorageSettingsPayload}
   */
  public async getOpenStorageSettings(): Promise<AppResult<OpenStorageSettingsPayload, AppError>> {
    return callResult(() =>
      this.httpClient.request<OpenStorageSettingsPayload>(
        OpenStorageSettingsRoutes.GET_OPEN_STORAGE_SETTINGS,
        { method: 'GET' }
      )
    )
  }
}
