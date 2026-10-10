import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUserRoutes, userPrivatePayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'

/** {@link SelfManagementUserApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementUserApi implements SelfManagementUserApi {
  /**
   * Constructs a new {@link FetchSelfManagementUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getUser(): Promise<AppResult<UserPrivatePayload, AppError>> {
    return callResult(async () => {
      const raw = await this.client.request<unknown>(SelfManagementUserRoutes.GET_USER)
      return userPrivatePayloadSchema.parse(raw)
    })
  }
}
