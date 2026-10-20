import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { createTestPagedResult, createTestUserSessionPrivate, createTestUserSessionSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type {
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivate,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionRepository } from '@/repository/session/session-repository'

/**
 * Mock implementation of {@link SessionRepository}.
 */
export class SessionRepositoryMock implements SessionRepository {
  public getSessionsResultProvider: () => Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> = async () =>
    appResultSuccess(createTestPagedResult({ items: createTestUserSessionSummaryList(2) }))

  public getSessionResultProvider: (userSessionId: UserSessionId) => Promise<AppResult<UserSessionPrivate, AppError>> = async () =>
    appResultSuccess(createTestUserSessionPrivate())

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
