import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { RefreshTokenPayload, SessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementRefreshTokenRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic, RefreshTokenApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Management {@link RefreshTokenApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementRefreshTokenApi implements RefreshTokenApi {
  /**
   * Constructs a new {@link FetchSelfManagementRefreshTokenApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async refreshToken(request: RefreshTokenPayload): Promise<AppResult<SessionTokenPayload, AppError>> {
    return callResult(() =>
      this.client.request<SessionTokenPayload>(SelfManagementRefreshTokenRoutes.REFRESH_TOKEN, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
