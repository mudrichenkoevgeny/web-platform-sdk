import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenAuthSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenAuthSettingsApi } from '@/network/api/auth/settings/open-auth-settings-api'

/** {@link OpenAuthSettingsApi} implementation backed by {@link HttpClient}. */
export class FetchOpenAuthSettingsApi implements OpenAuthSettingsApi {
  /**
   * Constructs a new {@link FetchOpenAuthSettingsApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getAuthSettings(): Promise<AppResult<OpenAuthSettingsPayload, AppError>> {
    return callResult(() =>
      this.client.request<OpenAuthSettingsPayload>(OpenAuthSettingsRoutes.GET_OPEN_AUTH_SETTINGS)
    )
  }
}
