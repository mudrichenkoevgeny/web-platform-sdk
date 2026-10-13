import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SelfSessionListParams,
  UserSessionId,
  UserSessionPrivate,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Manages active sessions linked to current authenticated account.
 */
export interface SessionRepository {
  /** Returns a paginated and filtered list of active sessions for current account. */
  getSessions(
    params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>>

  /** Returns details of a specific session. */
  getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>>

  /** Ends current active session on server. */
  logout(): Promise<AppResult<void, AppError>>

  /** Deletes a specific active session. */
  deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>>

  /** Deletes all sessions except the current active session. */
  deleteAllOtherSessions(): Promise<AppResult<void, AppError>>

  /** Performs re-authentication via TOTP for current session. */
  reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>>
}
