import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserRole,
  UserSessionPrivate,
  UserSessionSummary,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import { userSessionPrivateMock, userSessionSummaryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'

/** Mock implementation of {@link ManagementSessionRepository}. */
export class ManagementSessionRepositoryMock implements ManagementSessionRepository {
  public getSessionsResultProvider: () => Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> = async () =>
    appResultSuccess({
      items: [userSessionSummaryMock()],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1
    })

  public getSessionResultProvider: (sessionId: string) => Promise<AppResult<UserSessionPrivate, AppError>> = async () =>
    appResultSuccess(userSessionPrivateMock())

  public deleteSessionResultProvider: (
    userId: UserId,
    sessionId: string
  ) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public deleteAllUserSessionsResultProvider: (userId: UserId) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public lastUserId: UserId | null = null
  public lastSessionId: string | null = null

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
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    return this.getSessionsResultProvider()
  }

  public async getSession(sessionId: string): Promise<AppResult<UserSessionPrivate, AppError>> {
    this.lastSessionId = sessionId
    return this.getSessionResultProvider(sessionId)
  }

  public async deleteSession(userId: UserId, sessionId: string): Promise<AppResult<void, AppError>> {
    this.lastUserId = userId
    this.lastSessionId = sessionId
    return this.deleteSessionResultProvider(userId, sessionId)
  }

  public async deleteAllUserSessions(userId: UserId): Promise<AppResult<void, AppError>> {
    this.lastUserId = userId
    return this.deleteAllUserSessionsResultProvider(userId)
  }
}
