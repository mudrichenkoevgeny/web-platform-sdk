import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AccessTokenWithSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementRefreshTokenRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementRefreshTokenApi } from './self-management-refresh-token-api'

/** Management {@link SelfManagementRefreshTokenApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementRefreshTokenApi implements SelfManagementRefreshTokenApi {
  /**
   * Constructs a new {@link FetchSelfManagementRefreshTokenApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async refreshToken(refreshToken: string): Promise<AppResult<AccessTokenWithSessionId, AppError>> {
    return callResult(() =>
      this.client.request<AccessTokenWithSessionId>(SelfManagementRefreshTokenRoutes.REFRESH_TOKEN, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        ...markAsPublic()
      })
    )
  }
}
