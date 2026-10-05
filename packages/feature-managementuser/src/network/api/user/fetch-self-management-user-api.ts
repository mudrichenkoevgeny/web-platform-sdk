import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUserRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'

/** {@link SelfManagementUserApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementUserApi implements SelfManagementUserApi {
  /**
   * Constructs a new {@link FetchSelfManagementUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getUser(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserDetailsPayload>(SelfManagementUserRoutes.GET_USER)
    )
  }
}
