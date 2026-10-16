import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeletedSessions,
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Mock implementation of {@link SessionApi} for self management. */
export class SelfManagementSessionApiMock implements SessionApi {
  public getSessionsResult: AppResult<PagedResult<UserSessionSummaryPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public getSessionResult: AppResult<UserSessionPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public logoutResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteSessionResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteAllOtherSessionsResult: AppResult<DeletedSessions, AppError> = appResultFailure(CommonError.unknown())
  public reauthenticateSessionResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public async getSessions(
    _params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>> {
    return this.getSessionsResult
  }

  public async getSession(_userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivatePayload, AppError>> {
    return this.getSessionResult
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    return this.logoutResult
  }

  public async deleteSession(_userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    return this.deleteSessionResult
  }

  public async deleteAllOtherSessions(): Promise<AppResult<DeletedSessions, AppError>> {
    return this.deleteAllOtherSessionsResult
  }

  public async reauthenticateSession(_mfaToken: string, _code: string): Promise<AppResult<void, AppError>> {
    return this.reauthenticateSessionResult
  }
}
