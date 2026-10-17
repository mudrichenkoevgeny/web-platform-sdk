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
  ManagementGlobalSessionListParamsParser,
  ManagementSessionsRoutes,
  ManagementUserSessionListParamsParser,
  pagedResultSchema,
  UserApiPaths,
  userSessionPrivatePayloadSchema,
  userSessionSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionApi } from '@/network/api/session/management-session-api'

function isUserSpecificSessionParams(
  params: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null | undefined
): params is ManagementUserSessionListParams {
  return typeof params === 'object' && params !== null && 'userId' in params && typeof params.userId === 'string' && params.userId.length > 0
}

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
    let route: string
    let queryMap: Record<string, unknown> | null = null

    if (isUserSpecificSessionParams(params)) {
      route = ManagementSessionsRoutes.GET_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, params.userId ?? '')
      queryMap = ManagementUserSessionListParamsParser.toQueryMap(params)
    } else {
      route = ManagementSessionsRoutes.GET_SESSIONS
      queryMap = ManagementGlobalSessionListParamsParser.toQueryMap(params)
    }

    const path = appendQueryParamsToPath(route, queryMap)
    return callResult(async () => {
      const userSessionListResponse = await this.client.request<unknown>(path)
      return pagedResultSchema(userSessionSummaryPayloadSchema).parse(userSessionListResponse)
    })
  }

  public async getSession(sessionId: string): Promise<AppResult<UserSessionPrivatePayload, AppError>> {
    const path = ManagementSessionsRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, sessionId)
    return callResult(async () => {
      const userSessionResponse = await this.client.request<unknown>(path)
      return userSessionPrivatePayloadSchema.parse(userSessionResponse)
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
