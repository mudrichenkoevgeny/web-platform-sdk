import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type {
  DeletedSessionsPayload,
  PagedResult,
  UserSessionId,
  UserSessionPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { SessionApi } from '@/network/api/session/session-api'
/**
 * Mock implementation of {@link SessionApi}.
 */
export class SessionApiMock implements SessionApi {
  public getSessionsResult: AppResult<PagedResult<UserSessionPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public getSessionResult: AppResult<UserSessionPayload, AppError> = appResultFailure(CommonError.unknown())
  public logoutResult: AppResult<void, AppError> = appResultSuccess(undefined)
  public deleteSessionResult: AppResult<void, AppError> = appResultSuccess(undefined)
  public deleteAllOtherSessionsResult: AppResult<DeletedSessionsPayload, AppError> = appResultSuccess({ deleted_session_ids: [] })
  public reauthenticateSessionResult: AppResult<void, AppError> = appResultSuccess(undefined)

  public lastRequestedSessionId: UserSessionId | null = null
  public lastDeletedSessionId: UserSessionId | null = null
  public lastReauthenticateRequest: VerifyTotpPayload | null = null

  /** Mocks sessions list. */
  public async getSessions(): Promise<AppResult<PagedResult<UserSessionPayload>, AppError>> {
    return this.getSessionsResult
  }

  /** Mocks single session retrieval. */
  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPayload, AppError>> {
    this.lastRequestedSessionId = userSessionId
    return this.getSessionResult
  }

  /** Mocks logout. */
  public async logout(): Promise<AppResult<void, AppError>> {
    return this.logoutResult
  }

  /** Mocks single session deletion. */
  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    this.lastDeletedSessionId = userSessionId
    return this.deleteSessionResult
  }

  /** Mocks all other sessions deletion. */
  public async deleteAllOtherSessions(): Promise<AppResult<DeletedSessionsPayload, AppError>> {
    return this.deleteAllOtherSessionsResult
  }

  /** Mocks session re-authentication. */
  public async reauthenticateSession(request: VerifyTotpPayload): Promise<AppResult<void, AppError>> {
    this.lastReauthenticateRequest = request
    return this.reauthenticateSessionResult
  }
}
