import type { GetSessionsParams } from '@/repository/session/SessionRepository'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  DeletedSessionsPayload,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserSessionId,
  UserSessionPayload,
  UserSortValues,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Session listing, logout, and per-session revocation for the authenticated user. */
export interface SessionApi {
  /**
   * Returns a paginated and filtered list of active sessions for the current authenticated account.
   *
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param identifiers - Filters by free-text identifier values
   * @param identifierIds - Filters by unique credential record IDs
   * @param userAuthProviders - Filters by authentication provider types
   * @param clientTypes - Filters by client category types
   * @param userAgents - Filters by user agent substrings
   * @param ipAddresses - Filters by IP address substrings
   * @param languages - Filters by language tags
   * @param deviceIds - Filters by opaque unique device IDs
   * @param deviceNames - Filters by device name substrings
   * @param appVersions - Filters by application version strings
   * @param operationSystemVersions - Filters by operating system version substrings
   * @returns Paginated result containing matching active session payloads, or a mapped failure
   */
  getSessions(
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
  ): Promise<AppResult<PagedResult<UserSessionPayload>, AppError>>

  /**
   * Returns details of a specific session owned by current account.
   *
   * @param userSessionId - Unique session identifier
   * @returns Detailed session info or mapped failure
   */
  getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPayload, AppError>>

  /**
   * Ends current active session on the server.
   *
   * @returns Success indicator or mapped failure
   */
  logout(): Promise<AppResult<void, AppError>>

  /**
   * Deletes a specific active session by ID.
   *
   * @param userSessionId - Unique session identifier to revoke
   * @returns Success indicator or mapped failure
   */
  deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>>

  /**
   * Deletes all sessions except the current active session.
   *
   * @returns Deleted sessions summary or mapped failure
   */
  deleteAllOtherSessions(): Promise<AppResult<DeletedSessionsPayload, AppError>>

  /**
   * Performs re-authentication via TOTP for current session.
   *
   * @param request - Verification payload containing TOTP code
   * @returns Success indicator or mapped failure
   */
  reauthenticateSession(request: VerifyTotpPayload): Promise<AppResult<void, AppError>>
}
