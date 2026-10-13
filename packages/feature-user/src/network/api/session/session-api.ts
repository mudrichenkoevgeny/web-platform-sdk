import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeletedSessionsPayload,
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Session listing, logout, and per-session revocation for the authenticated user. */
export interface SessionApi {
  /**
   * Returns a paginated and filtered list of active sessions for the current authenticated account.
   *
   * @param params - Self session list query and filter parameters
   * @returns Paginated result containing matching active session payloads, or a mapped failure
   */
  getSessions(
    params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>>

  /**
   * Returns details of a specific session owned by current account.
   *
   * @param userSessionId - Unique session identifier
   * @returns Detailed session info or mapped failure
   */
  getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivatePayload, AppError>>

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
