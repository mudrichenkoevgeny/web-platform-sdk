import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserRole,
  UserSessionPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionApi } from '@/network/api/session/ManagementSessionApi'

/** Mock implementation of {@link ManagementSessionApi}. */
export class ManagementSessionApiMock implements ManagementSessionApi {
  public getSessionsResult: AppResult<PagedResult<UserSessionPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public getSessionResult: AppResult<UserSessionPayload, AppError> = appResultFailure(CommonError.unknown())
  public deleteSessionResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteAllUserSessionsResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public async getSessions(
    _pageNumber?: number | null,
    _pageSize?: number | null,
    _sortBy?: UserSortValues.UserSessionSortBy | null,
    _sortOrder?: SortOrder | null,
    _userIds?: string[] | null,
    _userRoles?: UserRole[] | null,
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

  public async getSession(_sessionId: string): Promise<AppResult<UserSessionPayload, AppError>> {
    return this.getSessionResult
  }

  public async deleteSession(_userId: UserId, _sessionId: string): Promise<AppResult<void, AppError>> {
    return this.deleteSessionResult
  }

  public async deleteAllUserSessions(_userId: UserId): Promise<AppResult<void, AppError>> {
    return this.deleteAllUserSessionsResult
  }
}
