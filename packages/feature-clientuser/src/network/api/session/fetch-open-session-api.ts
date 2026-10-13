import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeletedSessionsPayload,
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  OpenSessionRoutes,
  pagedResultSchema,
  UserApiPaths,
  userSessionPrivatePayloadSchema,
  userSessionSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Open {@link SessionApi} implementation backed by {@link HttpClient}. */
export class FetchOpenSessionApi implements SessionApi {
  /**
   * Constructs a new {@link FetchOpenSessionApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getSessions(
    params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>> {
    const path = appendQueryParamsToPath(
      OpenSessionRoutes.GET_SESSIONS,
      params
    )
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userSessionSummaryPayloadSchema).parse(raw)
    })
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivatePayload, AppError>> {
    const path = OpenSessionRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, userSessionId)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userSessionPrivatePayloadSchema.parse(raw)
    })
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenSessionRoutes.LOGOUT, { method: 'POST' })
    )
  }

  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    const path = OpenSessionRoutes.DELETE_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, userSessionId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteAllOtherSessions(): Promise<AppResult<DeletedSessionsPayload, AppError>> {
    return callResult(() =>
      this.client.request<DeletedSessionsPayload>(OpenSessionRoutes.DELETE_ALL_OTHER_SESSIONS, {
        method: 'DELETE'
      })
    )
  }

  public async reauthenticateSession(request: VerifyTotpPayload): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenSessionRoutes.REAUTHENTICATE_SESSION, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }
}
