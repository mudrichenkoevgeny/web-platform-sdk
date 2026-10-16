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
    const route = params && 'userId' in params && params.userId
      ? ManagementSessionsRoutes.GET_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, params.userId)
      : ManagementSessionsRoutes.GET_SESSIONS
    let queryParams: Record<string, unknown> | null = null
    if (params) {
      const { userId: _ignored, ...rest } = params as Record<string, unknown>
      queryParams = rest
    }
    const path = appendQueryParamsToPath(route, queryParams)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userSessionSummaryPayloadSchema).parse(raw)
    })
  }

  public async getSession(sessionId: string): Promise<AppResult<UserSessionPrivatePayload, AppError>> {
    const path = ManagementSessionsRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, sessionId)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userSessionPrivatePayloadSchema.parse(raw)
    })
  }

  public async deleteSession(_userId: UserId, sessionId: string): Promise<AppResult<void, AppError>> {
    const path = ManagementSessionsRoutes.DELETE_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, sessionId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteAllUserSessions(userId: UserId): Promise<AppResult<void, AppError>> {
    const path = ManagementSessionsRoutes.DELETE_ALL_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, userId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }
}
