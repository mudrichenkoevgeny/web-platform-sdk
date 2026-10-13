import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalSessionListParams,
  ManagementUserSessionListParams,
  PagedResult,
  UserId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ManagementSessionsRoutes,
  pagedResultSchema,
  UserApiPaths,
  userSessionPrivatePayloadSchema,
  userSessionSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionApi } from '@/network/api/session/management-session-api'

/** {@link ManagementSessionApi} implementation backed by {@link HttpClient}. */
export class FetchManagementSessionApi implements ManagementSessionApi {
  /**
   * Constructs a new {@link FetchManagementSessionApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getSessions(
    params?: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>> {
    const path = appendQueryParamsToPath(
      ManagementSessionsRoutes.GET_SESSIONS,
      params
    )
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userSessionSummaryPayloadSchema).parse(raw)
    })
  }

  public async getSession(sessionId: string): Promise<AppResult<UserSessionPrivatePayload, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.SESSION_ID]: sessionId })
    const path = `${ManagementSessionsRoutes.GET_SESSION}?${query.toString()}`
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userSessionPrivatePayloadSchema.parse(raw)
    })
  }

  public async deleteSession(userId: UserId, sessionId: string): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({
      [UserApiPaths.USER_ID]: userId,
      [UserApiPaths.SESSION_ID]: sessionId
    })
    const path = `${ManagementSessionsRoutes.DELETE_SESSION}?${query.toString()}`
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteAllUserSessions(userId: UserId): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_ID]: userId })
    const path = `${ManagementSessionsRoutes.DELETE_ALL_USER_SESSIONS}?${query.toString()}`
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }
}
