import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserRole,
  UserSession,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'

/** Administrative repository for managing user sessions across all accounts. */
export interface ManagementSessionRepository {
  /**
   * Returns a paginated and filtered list of active sessions based on search criteria.
   *
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param userIds - Filters by specific user identifiers
   * @param userRoles - Filters by user role types
   * @param identifiers - Filters by server-defined free-text identifier values
   * @param identifierIds - Filters by unique credential record IDs
   * @param userAuthProviders - Filters by authentication provider types
   * @param clientTypes - Filters by client category types
   * @param userAgents - Filters by server-defined user agent substrings
   * @param ipAddresses - Filters by server-defined IP address substrings
   * @param languages - Filters by server-defined language tags
   * @param deviceIds - Filters by opaque unique device IDs
   * @param deviceNames - Filters by server-defined device name substrings
   * @param appVersions - Filters by application version strings
   * @param operationSystemVersions - Filters by server-defined operating system version substrings
   * @returns Paginated result containing matching user session models, or a mapped failure
   */
  getSessions(
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
  ): Promise<AppResult<PagedResult<UserSession>, AppError>>

  /**
   * Retrieves specific session details.
   *
   * @param sessionId - Unique session identifier
   * @returns Detailed information of the target session model, or a mapped failure
   */
  getSession(sessionId: string): Promise<AppResult<UserSession, AppError>>

  /**
   * Deletes a specific session for the given user.
   *
   * @param userId - Unique identifier of the session owner
   * @param sessionId - Unique session identifier to revoke
   * @returns Void result or a mapped failure
   */
  deleteSession(userId: UserId, sessionId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes all active sessions for the specified user.
   *
   * @param userId - Unique identifier of the target account
   * @returns Void result or a mapped failure
   */
  deleteAllUserSessions(userId: UserId): Promise<AppResult<void, AppError>>
}
