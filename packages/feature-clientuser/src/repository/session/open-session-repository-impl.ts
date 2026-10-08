import { appResultSuccess, isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
import { toUserSession } from '@mudrichenkoevgeny/shared-foundation'
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
   * @param userStorage - Local user storage for caching active sessions
   * @param authStorage - Persistent authentication storage
   */
  public constructor(
    private readonly sessionApi: SessionApi,
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
    const networkResult = await this.sessionApi.getSessions(
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

    if (isSuccess(networkResult)) {
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
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSession, AppError>> {
    const networkResult = await this.sessionApi.getSession(userSessionId)
    if (isSuccess(networkResult)) {
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
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    const networkResult = await this.sessionApi.logout()
    await this.userStorage.clear()
    await this.authStorage.clearTokens()
    return networkResult
  }

  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    const networkResult = await this.sessionApi.deleteSession(userSessionId)
    if (isSuccess(networkResult)) {
      await this.userStorage.removeUserSession(userSessionId)
    }
    return networkResult
  }

  public async deleteAllOtherSessions(): Promise<AppResult<void, AppError>> {
    const networkResult = await this.sessionApi.deleteAllOtherSessions()
    if (isSuccess(networkResult)) {
      const deletedSessionIdsSet = new Set(networkResult.data.deleted_session_ids)
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
  }

  public async reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>> {
    return this.sessionApi.reauthenticateSession({
      mfa_token: mfaToken,
      totp_code: code
    })
  }
}
