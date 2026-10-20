import { createTestPagedResult, createTestUserSessionPrivate, createTestUserSessionSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalSessionListParams,
  ManagementUserSessionListParams,
  PagedResult,
  UserId,
  UserSessionPrivate,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'

/** Mock implementation of {@link ManagementSessionRepository}. */
export class ManagementSessionRepositoryMock implements ManagementSessionRepository {
  public getSessionsResultProvider: () => Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> = async () =>
    appResultSuccess(createTestPagedResult({
      items: createTestUserSessionSummaryList(2)
    }))

  public getSessionResultProvider: (sessionId: string) => Promise<AppResult<UserSessionPrivate, AppError>> = async () =>
    appResultSuccess(createTestUserSessionPrivate())

  public deleteSessionResultProvider: (
    userId: UserId,
    sessionId: string
  ) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public deleteAllUserSessionsResultProvider: (userId: UserId) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public lastUserId: UserId | null = null
  public lastSessionId: string | null = null

  public async getSessions(
    _params?: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null
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
