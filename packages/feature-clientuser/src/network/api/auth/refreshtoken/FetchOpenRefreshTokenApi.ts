import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { RefreshTokenPayload, SessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenRefreshTokenRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic, RefreshTokenApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Open {@link RefreshTokenApi} implementation backed by {@link HttpClient}. */
export class FetchOpenRefreshTokenApi implements RefreshTokenApi {
  /**
   * Constructs a new {@link FetchOpenRefreshTokenApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async refreshToken(request: RefreshTokenPayload): Promise<AppResult<SessionTokenPayload, AppError>> {
    return callResult(() =>
      this.client.request<SessionTokenPayload>(OpenRefreshTokenRoutes.REFRESH_TOKEN, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
