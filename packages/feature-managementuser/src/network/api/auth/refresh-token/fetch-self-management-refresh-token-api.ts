import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { RefreshTokenPayload, SessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementRefreshTokenRoutes, sessionTokenPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
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

  public async refreshToken(request: RefreshTokenPayload): Promise<AppResult<SessionTokenPayload, AppError>> {
    return callResult(async () => {
      const response = await this.client.request<unknown>(SelfManagementRefreshTokenRoutes.REFRESH_TOKEN, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
      return sessionTokenPayloadSchema.parse(response)
    })
  }
}
