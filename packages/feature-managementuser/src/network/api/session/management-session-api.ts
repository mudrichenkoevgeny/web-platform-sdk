import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalSessionListParams,
  ManagementUserSessionListParams,
  PagedResult,
  UserId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Administrative user sessions management. */
export interface ManagementSessionApi {
  /**
   * Returns a paginated and filtered list of active sessions based on search criteria.
   *
   * @param params - Query parameters for global or user-specific sessions list
   * @returns Paginated result containing matching session summary payloads, or a mapped failure
   */
  getSessions(
    params?: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>>

  /**
   * Retrieves specific session details.
   *
   * @param sessionId - Unique session identifier
   * @returns Detailed information of the target session, or a mapped failure
   */
  getSession(sessionId: string): Promise<AppResult<UserSessionPrivatePayload, AppError>>

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
