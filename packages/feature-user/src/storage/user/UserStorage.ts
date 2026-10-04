import {
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
import { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { UserSession } from '@mudrichenkoevgeny/shared-foundation'

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
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param userIds - Filters by specific user identifiers
   * @param userAuthProviders - Filters by authentication provider types
   * @param identifiers - Filters by free-text identifier values
   * @returns Paginated result containing matching user identifiers
   */
  getUserIdentifiersList(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userIds?: string[] | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<PagedResult<UserIdentifier>>

  /**
   * Observes paginated and filtered list of identifiers from local cache.
   *
   * @param listener - Callback function triggered on list update
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param userIds - Filters by specific user identifiers
   * @param userAuthProviders - Filters by authentication provider types
   * @param identifiers - Filters by free-text identifier values
   * @returns Unsubscribe function
   */
  observeUserIdentifiersList(
    listener: UserIdentifiersListChangeListener,
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userIds?: string[] | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
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
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param userIds - Filters by specific user IDs
   * @param userRoles - Filters by user role types
   * @param identifiers - Filters by free-text identifier values
   * @param identifierIds - Filters by credential record IDs
   * @param userAuthProviders - Filters by auth provider types
   * @param clientTypes - Filters by client category types
   * @param userAgents - Filters by user agent substrings
   * @param ipAddresses - Filters by IP address substrings
   * @param languages - Filters by language tags
   * @param deviceIds - Filters by unique device IDs
   * @param deviceNames - Filters by device name substrings
   * @param appVersions - Filters by app version strings
   * @param operationSystemVersions - Filters by OS version substrings
   * @returns Paginated result containing matching user session models
   */
  getUserSessionsList(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserSessionSortBy | null,
    sortOrder?: SortOrder | null,
    userIds?: string[] | null,
    userRoles?: UserRole[] | null,
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
  ): Promise<PagedResult<UserSession>>

  /**
   * Observes paginated and filtered list of active sessions from local cache.
   *
   * @param listener - Callback function triggered on list update
   * @returns Unsubscribe function
   */
  observeUserSessionsList(
    listener: UserSessionsListChangeListener,
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserSessionSortBy | null,
    sortOrder?: SortOrder | null,
    userIds?: string[] | null,
    userRoles?: UserRole[] | null,
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
