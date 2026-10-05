import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  DeletedSessionsPayload,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserSessionId,
  UserSessionPayload,
  UserSortValues,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Mock implementation of {@link SessionApi} for self management. */
export class SelfManagementSessionApiMock implements SessionApi {
  public getSessionsResult: AppResult<PagedResult<UserSessionPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public getSessionResult: AppResult<UserSessionPayload, AppError> = appResultFailure(CommonError.unknown())
  public logoutResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteSessionResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteAllOtherSessionsResult: AppResult<DeletedSessionsPayload, AppError> = appResultFailure(CommonError.unknown())
  public reauthenticateSessionResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public async getSessions(
    _pageNumber?: number | null,
    _pageSize?: number | null,
    _sortBy?: UserSortValues.UserSessionSortBy | null,
    _sortOrder?: SortOrder | null,
    _identifiers?: string[] | null,
    _identifierIds?: string[] | null,
    _userAuthProviders?: UserAuthProvider[] | null,
    _clientTypes?: ClientType[] | null,
    _userAgents?: string[] | null,
    _ipAddresses?: string[] | null,
    _languages?: string[] | null,
    _deviceIds?: string[] | null,
    _deviceNames?: string[] | null,
    _appVersions?: string[] | null,
    _operationSystemVersions?: string[] | null
  ): Promise<AppResult<PagedResult<UserSessionPayload>, AppError>> {
    return this.getSessionsResult
  }

  public async getSession(_userSessionId: UserSessionId): Promise<AppResult<UserSessionPayload, AppError>> {
    return this.getSessionResult
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    return this.logoutResult
  }

  public async deleteSession(_userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    return this.deleteSessionResult
  }

  public async deleteAllOtherSessions(): Promise<AppResult<DeletedSessionsPayload, AppError>> {
    return this.deleteAllOtherSessionsResult
  }

  public async reauthenticateSession(_request: VerifyTotpPayload): Promise<AppResult<void, AppError>> {
    return this.reauthenticateSessionResult
  }
}
