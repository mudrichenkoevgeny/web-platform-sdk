import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserRoutes, userDetailsPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUserApi } from '@/network/api/user/open-user-api'

/** {@link OpenUserApi} implementation backed by {@link HttpClient}. */
export class FetchOpenUserApi implements OpenUserApi {
  /**
   * Constructs a new {@link FetchOpenUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getUser(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return callResult(async () => {
      const raw = await this.client.request<unknown>(OpenUserRoutes.GET_USER)
      return userDetailsPayloadSchema.parse(raw)
    })
  }

  public async scheduleUserDeletion(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return callResult(async () => {
      const raw = await this.client.request<unknown>(OpenUserRoutes.SCHEDULE_DELETION, {
        method: 'DELETE'
      })
      return userDetailsPayloadSchema.parse(raw)
    })
  }

  public async restoreUser(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return callResult(async () => {
      const raw = await this.client.request<unknown>(OpenUserRoutes.RESTORE_USER, {
        method: 'POST'
      })
      return userDetailsPayloadSchema.parse(raw)
    })
  }
}
