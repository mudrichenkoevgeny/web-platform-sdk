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
import type { SessionRepository, AuthStorage, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SessionApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

class AsyncMutex {
  private queue: Promise<unknown> = Promise.resolve()

  public async runExclusive<T>(task: () => Promise<T>): Promise<T> {
    const res = this.queue.then(
      () => task(),
      () => task()
    )
    this.queue = res.catch(() => {})
    return res
  }
}

/**
 * Implements {@link SessionRepository} using {@link SessionApi}.
 */
export class SelfManagementSessionRepositoryImpl implements SessionRepository {
  private readonly mutex = new AsyncMutex()

  /**
   * Constructs a new {@link SelfManagementSessionRepositoryImpl}.
   *
   * @param selfManagementSessionApi - HTTP endpoints for session management and re-authentication
   * @param userStorage - Local persistent storage for user snapshot
   * @param authStorage - Storage holding authentication tokens
   */
  public constructor(
    private readonly selfManagementSessionApi: SessionApi,
    private readonly userStorage: UserStorage,
    private readonly authStorage: AuthStorage
  ) {}

  public async getSessions(
    params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    return this.mutex.runExclusive(async () => {
      const networkResult = await this.selfManagementSessionApi.getSessions(params)
      return mapSuccess(networkResult, (pagedPayload) => ({
        ...pagedPayload,
        items: pagedPayload.items.map((payload) => toUserSessionSummary(payload))
      }))
    })
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>> {
    return this.mutex.runExclusive(async () => {
      const networkResult = await this.selfManagementSessionApi.getSession(userSessionId)
      if (networkResult.success) {
        const session = toUserSessionPrivate(networkResult.data)
        return appResultSuccess(session)
      }

      return networkResult
    })
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    return this.mutex.runExclusive(async () => {
      const networkResult = await this.selfManagementSessionApi.logout()
      await this.userStorage.clear()
      await this.authStorage.clearTokens()
      return networkResult
    })
  }

  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    return this.mutex.runExclusive(async () => {
      return this.selfManagementSessionApi.deleteSession(userSessionId)
    })
  }

  public async deleteAllOtherSessions(): Promise<AppResult<void, AppError>> {
    return this.mutex.runExclusive(async () => {
      const networkResult = await this.selfManagementSessionApi.deleteAllOtherSessions()
      return mapSuccess(networkResult, () => undefined)
    })
  }

  public async reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>> {
    return this.selfManagementSessionApi.reauthenticateSession(mfaToken, code)
  }
}
