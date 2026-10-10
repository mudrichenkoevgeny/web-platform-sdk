import type {
  PagedResult,
  UserIdentifierId,
  UserIdentifierSummary,
  UserIdentifierSummaryPayload,
  UserPrivate,
  UserSessionId,
  UserSessionSummary,
  UserSessionSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { toUserIdentifierSummary, toUserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import type { UserStorage } from '@/storage/user/user-storage'
import type {
  GetUserIdentifiersListParams,
  GetUserSessionsListParams,
  UserChangeListener,
  UserIdentifiersListChangeListener,
  UserSessionsListChangeListener
} from '@/storage/user/user-storage'

/**
 * In-memory {@link UserStorage} mock for tests and previews.
 */
export class UserStorageMock implements UserStorage {
  private currentUserSnapshot: UserPrivate | null = null
  private identifiersPagedResult: PagedResult<UserIdentifierSummary> = {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  }
  private sessionsPagedResult: PagedResult<UserSessionSummary> = {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  }

  private readonly userListeners = new Set<UserChangeListener>()
  private readonly identifierListeners = new Set<UserIdentifiersListChangeListener>()
  private readonly sessionListeners = new Set<UserSessionsListChangeListener>()

  public isCleared = false
  public lastUpdatedIdentifiersPayload: PagedResult<UserIdentifierSummaryPayload> | null = null
  public lastRemovedIdentifierId: UserIdentifierId | null = null
  public lastUpdatedSessionsPayload: PagedResult<UserSessionSummaryPayload> | null = null
  public lastAddedSession: UserSessionSummary | null = null
  public lastRemovedSessionId: UserSessionId | null = null
  public lastRemovedSessionsList: UserSessionId[] | null = null

  public async getCurrentUser(): Promise<UserPrivate | null> {
    return this.currentUserSnapshot
  }

  public observeCurrentUser(listener: UserChangeListener): () => void {
    this.userListeners.add(listener)
    listener(this.currentUserSnapshot)
    return () => {
      this.userListeners.delete(listener)
    }
  }

  public async updateCurrentUser(currentUser: UserPrivate): Promise<void> {
    this.currentUserSnapshot = currentUser
    this.notifyUserListeners()
  }

  public async getUserIdentifiersList(_params?: GetUserIdentifiersListParams): Promise<PagedResult<UserIdentifierSummary>> {
    return this.identifiersPagedResult
  }

  public observeUserIdentifiersList(listener: UserIdentifiersListChangeListener, _params?: GetUserIdentifiersListParams): () => void {
    this.identifierListeners.add(listener)
    listener(this.identifiersPagedResult)
    return () => {
      this.identifierListeners.delete(listener)
    }
  }

  public async updateUserIdentifiersList(userIdentifiersList: PagedResult<UserIdentifierSummary>): Promise<void> {
    this.identifiersPagedResult = userIdentifiersList
    this.notifyIdentifierListeners()
  }

  public async updateUserIdentifiersPayloadList(
    userIdentifiersList: PagedResult<UserIdentifierSummaryPayload>
  ): Promise<void> {
    this.lastUpdatedIdentifiersPayload = userIdentifiersList
    const mappedItems = userIdentifiersList.items.map((payload) => toUserIdentifierSummary(payload))
    this.identifiersPagedResult = {
      items: mappedItems,
      totalCount: userIdentifiersList.totalCount,
      pageNumber: userIdentifiersList.pageNumber,
      pageSize: userIdentifiersList.pageSize,
      totalPages: userIdentifiersList.totalPages
    }
    this.notifyIdentifierListeners()
  }

  public async addUserIdentifier(userIdentifier: UserIdentifierSummary): Promise<void> {
    const items = [...this.identifiersPagedResult.items, userIdentifier]
    this.identifiersPagedResult = {
      items,
      totalCount: items.length,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1
    }
    this.notifyIdentifierListeners()
  }

  public async removeUserIdentifier(identifierId: UserIdentifierId): Promise<void> {
    this.lastRemovedIdentifierId = identifierId
    const items = this.identifiersPagedResult.items.filter((item) => item.id !== identifierId)
    this.identifiersPagedResult = {
      items,
      totalCount: items.length,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1
    }
    this.notifyIdentifierListeners()
  }

  public async getUserSessionsList(_params?: GetUserSessionsListParams): Promise<PagedResult<UserSessionSummary>> {
    return this.sessionsPagedResult
  }

  public observeUserSessionsList(listener: UserSessionsListChangeListener, _params?: GetUserSessionsListParams): () => void {
    this.sessionListeners.add(listener)
    listener(this.sessionsPagedResult)
    return () => {
      this.sessionListeners.delete(listener)
    }
  }

  public async updateUserSessionsList(userSessionsList: PagedResult<UserSessionSummary>): Promise<void> {
    this.sessionsPagedResult = userSessionsList
    this.notifySessionListeners()
  }

  public async updateUserSessionsPayloadList(
    userSessionsList: PagedResult<UserSessionSummaryPayload>
  ): Promise<void> {
    this.lastUpdatedSessionsPayload = userSessionsList
    const mappedItems = userSessionsList.items.map((payload) => toUserSessionSummary(payload))
    this.sessionsPagedResult = {
      items: mappedItems,
      totalCount: userSessionsList.totalCount,
      pageNumber: userSessionsList.pageNumber,
      pageSize: userSessionsList.pageSize,
      totalPages: userSessionsList.totalPages
    }
    this.notifySessionListeners()
  }

  public async addUserSession(userSession: UserSessionSummary): Promise<void> {
    this.lastAddedSession = userSession
    const items = [...this.sessionsPagedResult.items, userSession]
    this.sessionsPagedResult = {
      items,
      totalCount: items.length,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1
    }
    this.notifySessionListeners()
  }

  public async removeUserSession(sessionId: UserSessionId): Promise<void> {
    this.lastRemovedSessionId = sessionId
    await this.removeUserSessions([sessionId])
  }

  public async removeUserSessions(sessionIds: UserSessionId[]): Promise<void> {
    this.lastRemovedSessionsList = sessionIds
    const set = new Set(sessionIds)
    const items = this.sessionsPagedResult.items.filter((item) => !set.has(item.id))
    this.sessionsPagedResult = {
      items,
      totalCount: items.length,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1
    }
    this.notifySessionListeners()
  }

  public async clear(): Promise<void> {
    this.currentUserSnapshot = null
    this.identifiersPagedResult = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 0
    }
    this.sessionsPagedResult = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 0
    }
    this.isCleared = true
    this.notifyUserListeners()
    this.notifyIdentifierListeners()
    this.notifySessionListeners()
  }

  private notifyUserListeners(): void {
    for (const listener of this.userListeners) {
      listener(this.currentUserSnapshot)
    }
  }

  private notifyIdentifierListeners(): void {
    for (const listener of this.identifierListeners) {
      listener(this.identifiersPagedResult)
    }
  }

  private notifySessionListeners(): void {
    for (const listener of this.sessionListeners) {
      listener(this.sessionsPagedResult)
    }
  }
}
