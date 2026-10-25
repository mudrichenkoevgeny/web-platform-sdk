import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeletedSessions,
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  deletedSessionsPayloadSchema,
  pagedResultSchema,
  SelfManagementSessionRoutes,
  SelfSessionListParamsParser,
  toDeletedSessions,
  UserApiPaths,
  userSessionPrivatePayloadSchema,
  userSessionSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementSessionApi } from './self-management-session-api'

/** Self-management {@link SelfManagementSessionApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementSessionApi implements SelfManagementSessionApi {
  /**
   * Constructs a new {@link FetchSelfManagementSessionApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getSessions(
    params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>> {
    const queryMap = SelfSessionListParamsParser.toQueryMap(params)
    const path = appendQueryParamsToPath(
      SelfManagementSessionRoutes.GET_SESSIONS,
      queryMap
    )
    return callResult(async () => {
      const userSessionListResponse = await this.client.request<unknown>(path)
      return pagedResultSchema(userSessionSummaryPayloadSchema).parse(userSessionListResponse)
    })
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivatePayload, AppError>> {
    const path = SelfManagementSessionRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, userSessionId)
    return callResult(async () => {
      const userSessionResponse = await this.client.request<unknown>(path)
      return userSessionPrivatePayloadSchema.parse(userSessionResponse)
    })
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(SelfManagementSessionRoutes.LOGOUT, { method: 'POST' })
    )
  }

  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    const path = SelfManagementSessionRoutes.DELETE_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, userSessionId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteAllOtherSessions(): Promise<AppResult<DeletedSessions, AppError>> {
    return callResult(async () => {
      const deletedSessionsResponse = await this.client.request<unknown>(SelfManagementSessionRoutes.DELETE_ALL_OTHER_SESSIONS, {
        method: 'DELETE'
      })
      const payload = deletedSessionsPayloadSchema.parse(deletedSessionsResponse)
      return toDeletedSessions(payload)
    })
  }

  public async reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>> {
    const payload: VerifyTotpPayload = {
      mfa_token: mfaToken,
      totp_code: code
    }
    return callResult(() =>
      this.client.request<void>(SelfManagementSessionRoutes.REAUTHENTICATE_SESSION, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }
}
