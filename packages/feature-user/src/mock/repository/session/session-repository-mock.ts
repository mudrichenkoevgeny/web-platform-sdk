import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type {
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivate,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionRepository } from '@/repository/session/session-repository'
import { userSessionPrivateMock, userSessionSummaryMock } from '@/mock/domain/model/session/user-session-mock'

/**
 * Mock implementation of {@link SessionRepository}.
 */
export class SessionRepositoryMock implements SessionRepository {
  public getSessionsResultProvider: () => Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> = async () =>
    appResultSuccess({ items: [userSessionSummaryMock()], totalCount: 1, pageNumber: 1, pageSize: 20, totalPages: 1 })

  public getSessionResultProvider: (userSessionId: UserSessionId) => Promise<AppResult<UserSessionPrivate, AppError>> = async () =>
    appResultSuccess(userSessionPrivateMock())

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
    _params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    return this.getSessionsResultProvider()
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>> {
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
