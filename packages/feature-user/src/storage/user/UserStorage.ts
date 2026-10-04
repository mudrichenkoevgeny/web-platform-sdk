import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserIdentifierPayload,
  UserRole,
  UserSessionId,
  UserSessionPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Observer listener signature for current user profile changes.
 */
export type UserChangeListener = (user: UserDetails | null) => void

/**
 * Observer listener signature for identifier list changes.
 */
export type UserIdentifiersListChangeListener = (result: PagedResult<UserIdentifier>) => void

/**
 * Observer listener signature for session list changes.
 */
export type UserSessionsListChangeListener = (result: PagedResult<UserSession>) => void

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
   * @returns UserDetails or null
   */
  getCurrentUser(): Promise<UserDetails | null>

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
  updateCurrentUser(currentUser: UserDetails): Promise<void>

  /**
   * Retrieves a paginated and filtered list of identifiers from local cache based on search criteria.
   *
   * @param params - Search and filter parameters
   * @returns Paginated result containing matching user identifiers
   */
  getUserIdentifiersList(params?: GetUserIdentifiersListParams): Promise<PagedResult<UserIdentifier>>

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
  updateUserIdentifiersList(userIdentifiersList: PagedResult<UserIdentifier>): Promise<void>

  /**
   * Replaces stored identifiers payload list.
   *
   * @param userIdentifiersList - New paged payload result
   */
  updateUserIdentifiersPayloadList(userIdentifiersList: PagedResult<UserIdentifierPayload>): Promise<void>

  /**
   * Adds or updates a single identifier in local cache.
   *
   * @param userIdentifier - Identifier model to add
   */
  addUserIdentifier(userIdentifier: UserIdentifier): Promise<void>

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
  getUserSessionsList(params?: GetUserSessionsListParams): Promise<PagedResult<UserSession>>

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
  updateUserSessionsList(userSessionsList: PagedResult<UserSession>): Promise<void>

  /**
   * Replaces stored sessions payload list.
   *
   * @param userSessionsList - New paged payload result
   */
  updateUserSessionsPayloadList(userSessionsList: PagedResult<UserSessionPayload>): Promise<void>

  /**
   * Adds or updates a single user session in local cache.
   *
   * @param userSession - Session model to add
   */
  addUserSession(userSession: UserSession): Promise<void>

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
