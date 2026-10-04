import type {
  PagedResult,
  UserIdentifierId,
  UserIdentifierPayload,
  UserSessionId,
  UserSessionPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  UserStorage
} from '@/storage/user/UserStorage'
import type {
  GetUserIdentifiersListParams,
  GetUserSessionsListParams,
  UserChangeListener,
  UserIdentifiersListChangeListener,
  UserSessionsListChangeListener
} from '@/storage/user/UserStorage'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import { toUserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifier } from "@mudrichenkoevgeny/shared-foundation";
import { toUserSession } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSession } from "@mudrichenkoevgeny/shared-foundation";

/**
 * In-memory {@link UserStorage} mock for tests and previews.
 */
export class UserStorageMock implements UserStorage {
  private currentUserSnapshot: UserDetails | null = null
  private identifiersPagedResult: PagedResult<UserIdentifier> = {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  }
  private sessionsPagedResult: PagedResult<UserSession> = {
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
  public lastUpdatedIdentifiersPayload: PagedResult<UserIdentifierPayload> | null = null
  public lastRemovedIdentifierId: UserIdentifierId | null = null
  public lastUpdatedSessionsPayload: PagedResult<UserSessionPayload> | null = null
  public lastAddedSession: UserSession | null = null
  public lastRemovedSessionId: UserSessionId | null = null
  public lastRemovedSessionsList: UserSessionId[] | null = null

  public async getCurrentUser(): Promise<UserDetails | null> {
    return this.currentUserSnapshot
  }

  public observeCurrentUser(listener: UserChangeListener): () => void {
    this.userListeners.add(listener)
    listener(this.currentUserSnapshot)
    return () => {
      this.userListeners.delete(listener)
    }
  }

  public async updateCurrentUser(currentUser: UserDetails): Promise<void> {
    this.currentUserSnapshot = currentUser
    this.notifyUserListeners()
  }

  public async getUserIdentifiersList(_params?: GetUserIdentifiersListParams): Promise<PagedResult<UserIdentifier>> {
    return this.identifiersPagedResult
  }

  public observeUserIdentifiersList(listener: UserIdentifiersListChangeListener, _params?: GetUserIdentifiersListParams): () => void {
    this.identifierListeners.add(listener)
    listener(this.identifiersPagedResult)
    return () => {
      this.identifierListeners.delete(listener)
    }
  }

  public async updateUserIdentifiersList(userIdentifiersList: PagedResult<UserIdentifier>): Promise<void> {
    this.identifiersPagedResult = userIdentifiersList
    this.notifyIdentifierListeners()
  }

  public async updateUserIdentifiersPayloadList(
    userIdentifiersList: PagedResult<UserIdentifierPayload>
  ): Promise<void> {
    this.lastUpdatedIdentifiersPayload = userIdentifiersList
    const mappedItems = userIdentifiersList.items.map((payload) => toUserIdentifier(payload))
    this.identifiersPagedResult = {
      items: mappedItems,
      totalCount: userIdentifiersList.totalCount,
      pageNumber: userIdentifiersList.pageNumber,
      pageSize: userIdentifiersList.pageSize,
      totalPages: userIdentifiersList.totalPages
    }
    this.notifyIdentifierListeners()
  }

  public async addUserIdentifier(userIdentifier: UserIdentifier): Promise<void> {
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

  public async getUserSessionsList(_params?: GetUserSessionsListParams): Promise<PagedResult<UserSession>> {
    return this.sessionsPagedResult
  }

  public observeUserSessionsList(listener: UserSessionsListChangeListener, _params?: GetUserSessionsListParams): () => void {
    this.sessionListeners.add(listener)
    listener(this.sessionsPagedResult)
    return () => {
      this.sessionListeners.delete(listener)
    }
  }

  public async updateUserSessionsList(userSessionsList: PagedResult<UserSession>): Promise<void> {
    this.sessionsPagedResult = userSessionsList
    this.notifySessionListeners()
  }

  public async updateUserSessionsPayloadList(
    userSessionsList: PagedResult<UserSessionPayload>
  ): Promise<void> {
    this.lastUpdatedSessionsPayload = userSessionsList
    const mappedItems = userSessionsList.items.map((payload) => toUserSession(payload))
    this.sessionsPagedResult = {
      items: mappedItems,
      totalCount: userSessionsList.totalCount,
      pageNumber: userSessionsList.pageNumber,
      pageSize: userSessionsList.pageSize,
      totalPages: userSessionsList.totalPages
    }
    this.notifySessionListeners()
  }

  public async addUserSession(userSession: UserSession): Promise<void> {
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
