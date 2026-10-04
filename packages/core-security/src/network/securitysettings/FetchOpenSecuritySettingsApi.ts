import { OpenSecuritySettingsPayload, OpenSecuritySettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { callResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { HttpClient, AppResult, AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { OpenSecuritySettingsApi } from '@/network/securitysettings/OpenSecuritySettingsApi'
/**
 * Fetch HTTP client implementation of {@link OpenSecuritySettingsApi}.
 */
export class FetchOpenSecuritySettingsApi implements OpenSecuritySettingsApi {
  /**
   * Constructs a new {@link FetchOpenSecuritySettingsApi}.
   *
   * @param httpClient - Configured SDK HTTP client instance
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Executes HTTP GET request to retrieve open security settings payload.
   *
   * @returns AppResult wrapping {@link OpenSecuritySettingsPayload}
   */
  public async getSecuritySettings(): Promise<AppResult<OpenSecuritySettingsPayload, AppError>> {
    return callResult(() =>
      this.httpClient.request<OpenSecuritySettingsPayload>(
        OpenSecuritySettingsRoutes.GET_OPEN_SECURITY_SETTINGS,
        { method: 'GET' }
      )
    )
  }
}
