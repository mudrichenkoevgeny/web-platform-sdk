import { appResultSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivate,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'
import { toUserSessionPrivate, toUserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import type {
  AuthStorage,
  SessionApi,
  SessionRepository,
  UserStorage
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/**
 * Implements {@link SessionRepository} using {@link SessionApi}, {@link UserStorage}, and {@link AuthStorage}.
 */
export class OpenSessionRepositoryImpl implements SessionRepository {
  /**
   * Constructs a new {@link OpenSessionRepositoryImpl}.
   *
   * @param sessionApi - HTTP endpoints for session management and re-authentication
   * @param userStorage - Local user storage for clearing user data on logout
   * @param authStorage - Persistent authentication storage
   */
  public constructor(
    private readonly sessionApi: SessionApi,
    private readonly userStorage: UserStorage,
    private readonly authStorage: AuthStorage
  ) {}

  public async getSessions(
    params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    const networkResult = await this.sessionApi.getSessions(params)

    return mapSuccess(networkResult, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) => toUserSessionSummary(payload))
    }))
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>> {
    const networkResult = await this.sessionApi.getSession(userSessionId)
    if (networkResult.success) {
      const session = toUserSessionPrivate(networkResult.data)
      return appResultSuccess(session)
    }

    return networkResult
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    const networkResult = await this.sessionApi.logout()
    await this.userStorage.clear()
    await this.authStorage.clearTokens()
    return networkResult
  }

  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    return this.sessionApi.deleteSession(userSessionId)
  }

  public async deleteAllOtherSessions(): Promise<AppResult<void, AppError>> {
    const networkResult = await this.sessionApi.deleteAllOtherSessions()
    return mapSuccess(networkResult, () => undefined)
  }

  public async reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>> {
    return this.sessionApi.reauthenticateSession(mfaToken, code)
  }
}
