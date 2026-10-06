import { appResultSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserSession,
  UserSessionId,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import { toUserSession, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
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
 * Falls back to {@link UserStorage} cache with client-side filtering and pagination if network calls fail.
 */
export class SelfManagementSessionRepositoryImpl implements SessionRepository {
  private readonly mutex = new AsyncMutex()

  /**
   * Constructs a new {@link SelfManagementSessionRepositoryImpl}.
   *
   * @param selfManagementSessionApi - HTTP endpoints for session management and re-authentication
   * @param userStorage - Local persistent storage cache for user snapshots and data fallback
   * @param authStorage - Storage holding authentication tokens
   */
  public constructor(
    private readonly selfManagementSessionApi: SessionApi,
    private readonly userStorage: UserStorage,
    private readonly authStorage: AuthStorage
  ) {}

  public async getSessions(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserSessionSortBy | null,
    sortOrder?: SortOrder | null,
    identifiers?: string[] | null,
    identifierIds?: string[] | null,
    userAuthProviders?: UserAuthProvider[] | null,
    clientTypes?: ClientType[] | null,
    userAgents?: string[] | null,
    ipAddresses?: string[] | null,
    languages?: string[] | null,
    deviceIds?: string[] | null,
    deviceNames?: string[] | null,
    appVersions?: string[] | null,
    operationSystemVersions?: string[] | null
  ): Promise<AppResult<PagedResult<UserSession>, AppError>> {
    return this.mutex.runExclusive(async () => {
      const networkResult = await this.selfManagementSessionApi.getSessions(
        pageNumber,
        pageSize,
        sortBy,
        sortOrder,
        identifiers,
        identifierIds,
        userAuthProviders,
        clientTypes,
        userAgents,
        ipAddresses,
        languages,
        deviceIds,
        deviceNames,
        appVersions,
        operationSystemVersions
      )
      if (networkResult.success) {
        await this.userStorage.updateUserSessionsPayloadList(networkResult.data)
        return mapSuccess(networkResult, (pagedPayload) => ({
          ...pagedPayload,
          items: pagedPayload.items.map((payload) => toUserSession(payload))
        }))
      }

      const cachedResult = await this.userStorage.getUserSessionsList({
        pageNumber,
        pageSize,
        sortBy,
        sortOrder,
        identifiers,
        identifierIds,
        userAuthProviders,
        clientTypes,
        userAgents,
        ipAddresses,
        languages,
        deviceIds,
        deviceNames,
        appVersions,
        operationSystemVersions
      })
      if (cachedResult.items.length > 0) {
        return appResultSuccess(cachedResult)
      }

      return networkResult
    })
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSession, AppError>> {
    return this.mutex.runExclusive(async () => {
      const networkResult = await this.selfManagementSessionApi.getSession(userSessionId)
      if (networkResult.success) {
        const session = toUserSession(networkResult.data)
        await this.userStorage.addUserSession(session)
        return appResultSuccess(session)
      }

      const cachedList = await this.userStorage.getUserSessionsList()
      const cachedSession = cachedList.items.find((userSession) => userSession.id === userSessionId)
      if (cachedSession) {
        return appResultSuccess(cachedSession)
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
      const networkResult = await this.selfManagementSessionApi.deleteSession(userSessionId)
      if (networkResult.success) {
        await this.userStorage.removeUserSession(userSessionId)
      }
      return networkResult
    })
  }

  public async deleteAllOtherSessions(): Promise<AppResult<void, AppError>> {
    return this.mutex.runExclusive(async () => {
      const networkResult = await this.selfManagementSessionApi.deleteAllOtherSessions()
      if (networkResult.success) {
        const deletedSessionIdsSet = new Set(
          networkResult.data.deleted_session_ids.map((id) => toUserSessionIdOrThrow(id))
        )
        if (deletedSessionIdsSet.size > 0) {
          const cachedList = await this.userStorage.getUserSessionsList()
          const idsToRemove = cachedList.items
            .map((item) => item.id)
            .filter((id) => deletedSessionIdsSet.has(id))

          if (idsToRemove.length > 0) {
            await this.userStorage.removeUserSessions(idsToRemove)
          }
        }
      }
      return mapSuccess(networkResult, () => undefined)
    })
  }

  public async reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>> {
    return this.selfManagementSessionApi.reauthenticateSession({
      mfa_token: mfaToken,
      totp_code: code
    })
  }
}
