import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeletedSessions,
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Management REST API client interface for managing the current staff member's active sessions. */
export interface SelfManagementSessionApi {
  /**
   * Returns a paginated list of active sessions for current staff account.
   */
  getSessions(
    params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>>

  /**
   * Retrieves details of a specific session owned by current staff account.
   */
  getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivatePayload, AppError>>

  /**
   * Ends current staff session on server.
   */
  logout(): Promise<AppResult<void, AppError>>

  /**
   * Revokes a specific active session owned by current staff account.
   */
  deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>>

  /**
   * Revokes all active sessions except current active session.
   */
  deleteAllOtherSessions(): Promise<AppResult<DeletedSessions, AppError>>

  /**
   * Performs re-authentication via TOTP for current session.
   */
  reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>>
}
