import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserIdentifierSummary,
  UserIdentifierSummaryPayload,
  UserPrivate,
  UserRole,
  UserSessionId,
  UserSessionSummary,
  UserSessionSummaryPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Observer listener signature for current user profile changes.
 */
export type UserChangeListener = (user: UserPrivate | null) => void

/**
 * Observer listener signature for identifier list changes.
 */
export type UserIdentifiersListChangeListener = (result: PagedResult<UserIdentifierSummary>) => void

/**
 * Observer listener signature for session list changes.
 */
export type UserSessionsListChangeListener = (result: PagedResult<UserSessionSummary>) => void

/**
 * Persists user-scoped profile data (current user snapshot, identifiers, sessions) for offline and UI use.
 */

export interface GetUserIdentifiersListParams {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: UserSortValues.UserIdentifierSortBy | null
  sortOrder?: SortOrder | null
  userIds?: string[] | null
  userAuthProviders?: UserAuthProvider[] | null
  identifiers?: string[] | null
}

export interface GetUserSessionsListParams {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: UserSortValues.UserSessionSortBy | null
  sortOrder?: SortOrder | null
  userIds?: string[] | null
  userRoles?: UserRole[] | null
  identifiers?: string[] | null
  identifierIds?: string[] | null
  userAuthProviders?: UserAuthProvider[] | null
  clientTypes?: ClientType[] | null
  userAgents?: string[] | null
  ipAddresses?: string[] | null
  languages?: string[] | null
  deviceIds?: string[] | null
  deviceNames?: string[] | null
  appVersions?: string[] | null
  operationSystemVersions?: string[] | null
}

export interface UserStorage {
  /**
   * Retrieves cached user details snapshot, or null if unstored.
   *
   * @returns UserPrivate or null
   */
  getCurrentUser(): Promise<UserPrivate | null>

  /**
   * Observes changes to current user snapshot.
   *
   * @param listener - Callback function triggered on user update
   * @returns Unsubscribe function
   */
  observeCurrentUser(listener: UserChangeListener): () => void

  /**
   * Replaces cached active user snapshot.
   *
   * @param currentUser - New user details to persist
   */
  updateCurrentUser(currentUser: UserPrivate): Promise<void>

  /**
   * Retrieves a paginated and filtered list of identifiers from local cache based on search criteria.
   *
   * @param params - Search and filter parameters
   * @returns Paginated result containing matching user identifiers
   */
  getUserIdentifiersList(params?: GetUserIdentifiersListParams): Promise<PagedResult<UserIdentifierSummary>>

  /**
   * Observes paginated and filtered list of identifiers from local cache.
   *
   * @param listener - Callback function triggered on list update
   * @param params - Search and filter parameters
   * @returns Unsubscribe function
   */
  observeUserIdentifiersList(
    listener: UserIdentifiersListChangeListener,
    params?: GetUserIdentifiersListParams
  ): () => void

  /**
   * Replaces stored identifiers paged result.
   *
   * @param userIdentifiersList - New paged result
   */
  updateUserIdentifiersList(userIdentifiersList: PagedResult<UserIdentifierSummary>): Promise<void>

  /**
   * Replaces stored identifiers payload list.
   *
   * @param userIdentifiersList - New paged payload result
   */
  updateUserIdentifiersPayloadList(userIdentifiersList: PagedResult<UserIdentifierSummaryPayload>): Promise<void>

  /**
   * Adds or updates a single identifier in local cache.
   *
   * @param userIdentifier - Identifier model to add
   */
  addUserIdentifier(userIdentifier: UserIdentifierSummary): Promise<void>

  /**
   * Removes an identifier by ID from local cache.
   *
   * @param identifierId - Target identifier ID
   */
  removeUserIdentifier(identifierId: UserIdentifierId): Promise<void>

  /**
   * Retrieves a paginated and filtered list of active sessions from local cache.
   *
   * @param params - Search and filter parameters
   * @returns Paginated result containing matching user session models
   */
  getUserSessionsList(params?: GetUserSessionsListParams): Promise<PagedResult<UserSessionSummary>>

  /**
   * Observes paginated and filtered list of active sessions from local cache.
   *
   * @param listener - Callback function triggered on list update
   * @param params - Search and filter parameters
   * @returns Unsubscribe function
   */
  observeUserSessionsList(
    listener: UserSessionsListChangeListener,
    params?: GetUserSessionsListParams
  ): () => void

  /**
   * Replaces stored sessions paged result.
   *
   * @param userSessionsList - New paged result
   */
  updateUserSessionsList(userSessionsList: PagedResult<UserSessionSummary>): Promise<void>

  /**
   * Replaces stored sessions payload list.
   *
   * @param userSessionsList - New paged payload result
   */
  updateUserSessionsPayloadList(userSessionsList: PagedResult<UserSessionSummaryPayload>): Promise<void>

  /**
   * Adds or updates a single user session in local cache.
   *
   * @param userSession - Session model to add
   */
  addUserSession(userSession: UserSessionSummary): Promise<void>

  /**
   * Removes a user session by ID from local cache.
   *
   * @param sessionId - Target session ID
   */
  removeUserSession(sessionId: UserSessionId): Promise<void>

  /**
   * Removes multiple user sessions by ID from local cache.
   *
   * @param sessionIds - Target session IDs to remove
   */
  removeUserSessions(sessionIds: UserSessionId[]): Promise<void>

  /**
   * Drops all user-scoped cached entries managed by this storage.
   */
  clear(): Promise<void>
}
