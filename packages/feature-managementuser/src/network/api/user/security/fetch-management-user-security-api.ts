import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementUsersSecurityRoutes, UserApiPaths } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserSecurityApi } from '@/network/api/user/security/management-user-security-api'

/** {@link ManagementUserSecurityApi} implementation backed by {@link HttpClient}. */
export class FetchManagementUserSecurityApi implements ManagementUserSecurityApi {
  /**
   * Constructs a new {@link FetchManagementUserSecurityApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async disableTotp(userId: UserId): Promise<AppResult<void, AppError>> {
    const path = ManagementUsersSecurityRoutes.DISABLE_TOTP.replace(`{${UserApiPaths.USER_ID}}`, userId)
    return callResult(() =>
      this.client.request<void>(path, {
        method: 'DELETE'
      })
    )
  }
}
