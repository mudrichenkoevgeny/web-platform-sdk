import { OpenGlobalSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { callResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { HttpClient, AppResult, AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { OpenGlobalSettingsApi } from '@/network/global-settings/open-global-settings-api'
/**
 * Fetch HTTP client implementation of {@link OpenGlobalSettingsApi}.
 */
export class FetchOpenGlobalSettingsApi implements OpenGlobalSettingsApi {
  /**
   * Constructs a new {@link FetchOpenGlobalSettingsApi}.
   *
   * @param httpClient - Configured SDK HTTP client instance
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Executes HTTP GET request to retrieve open global settings payload.
   *
   * @returns AppResult wrapping {@link OpenGlobalSettingsPayload}
   */
  public async getOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettingsPayload, AppError>> {
    return callResult(() =>
      this.httpClient.request<OpenGlobalSettingsPayload>(
        OpenGlobalSettingsRoutes.GET_OPEN_GLOBAL_SETTINGS,
        { method: 'GET' }
      )
    )
  }
}
