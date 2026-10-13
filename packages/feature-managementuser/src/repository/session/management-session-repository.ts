import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalSessionListParams,
  ManagementUserSessionListParams,
  PagedResult,
  UserId,
  UserSessionPrivate,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'

/** Administrative repository for managing user sessions across all accounts. */
export interface ManagementSessionRepository {
  /**
   * Returns a paginated and filtered list of active sessions based on search criteria.
   *
   * @param params - Query parameters for global or user-specific session list
   * @returns Paginated result containing matching user session summary models, or a mapped failure
   */
  getSessions(
    params?: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>>

  /**
   * Retrieves specific session details.
   *
   * @param sessionId - Unique session identifier
   * @returns Detailed information of the target session model, or a mapped failure
   */
  getSession(sessionId: string): Promise<AppResult<UserSessionPrivate, AppError>>

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
