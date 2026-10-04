import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUserApi } from '@/network/api/user/OpenUserApi'

/** {@link OpenUserApi} implementation backed by {@link HttpClient}. */
export class FetchOpenUserApi implements OpenUserApi {
  /**
   * Constructs a new {@link FetchOpenUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getUser(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserDetailsPayload>(OpenUserRoutes.GET_USER)
    )
  }

  public async scheduleUserDeletion(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserDetailsPayload>(OpenUserRoutes.SCHEDULE_DELETION, {
        method: 'DELETE'
      })
    )
  }

  public async restoreUser(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserDetailsPayload>(OpenUserRoutes.RESTORE_USER, {
        method: 'POST'
      })
    )
  }
}
