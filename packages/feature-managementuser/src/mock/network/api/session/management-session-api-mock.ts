import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalSessionListParams,
  ManagementUserSessionListParams,
  PagedResult,
  UserId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionApi } from '@/network/api/session/management-session-api'

/** Mock implementation of {@link ManagementSessionApi}. */
export class ManagementSessionApiMock implements ManagementSessionApi {
  public getSessionsResult: AppResult<PagedResult<UserSessionSummaryPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public getSessionResult: AppResult<UserSessionPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public deleteSessionResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteAllUserSessionsResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public async getSessions(
    _params?: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>> {
    return this.getSessionsResult
  }

  public async getSession(_sessionId: string): Promise<AppResult<UserSessionPrivatePayload, AppError>> {
    return this.getSessionResult
  }

  public async deleteSession(_userId: UserId, _sessionId: string): Promise<AppResult<void, AppError>> {
    return this.deleteSessionResult
  }

  public async deleteAllUserSessions(_userId: UserId): Promise<AppResult<void, AppError>> {
    return this.deleteAllUserSessionsResult
  }
}
