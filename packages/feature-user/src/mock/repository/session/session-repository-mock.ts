import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserSessionId,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionRepository } from '@/repository/session/session-repository'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import { userSessionMock } from '@/mock/domain/model/session/user-session-mock'
/**
 * Mock implementation of {@link SessionRepository}.
 */
export class SessionRepositoryMock implements SessionRepository {
  public getSessionsResultProvider: () => Promise<AppResult<PagedResult<UserSession>, AppError>> = async () =>
    appResultSuccess({ items: [userSessionMock()], totalCount: 1, pageNumber: 1, pageSize: 20, totalPages: 1 })

  public getSessionResultProvider: (userSessionId: UserSessionId) => Promise<AppResult<UserSession, AppError>> = async () =>
    appResultSuccess(userSessionMock())

  public logoutResultProvider: () => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public deleteSessionResultProvider: (userSessionId: UserSessionId) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public deleteAllOtherSessionsResultProvider: () => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public reauthenticateSessionResultProvider: (mfaToken: string, code: string) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public lastSessionId: UserSessionId | null = null
  public lastMfaToken: string | null = null
  public lastCode: string | null = null

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
  ): Promise<AppResult<PagedResult<UserSession>, AppError>> {
    return this.getSessionsResultProvider()
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSession, AppError>> {
    this.lastSessionId = userSessionId
    return this.getSessionResultProvider(userSessionId)
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    return this.logoutResultProvider()
  }

  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    this.lastSessionId = userSessionId
    return this.deleteSessionResultProvider(userSessionId)
  }

  public async deleteAllOtherSessions(): Promise<AppResult<void, AppError>> {
    return this.deleteAllOtherSessionsResultProvider()
  }

  public async reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>> {
    this.lastMfaToken = mfaToken
    this.lastCode = code
    return this.reauthenticateSessionResultProvider(mfaToken, code)
  }
}
