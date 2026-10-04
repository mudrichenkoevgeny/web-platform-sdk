import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserSessionId,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'

/** Parameters for filtering and paginating sessions. */
export interface GetSessionsParams {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: UserSortValues.UserSessionSortBy | null
  sortOrder?: SortOrder | null
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

/**
 * Manages active sessions linked to current authenticated account.
 */
export interface SessionRepository {
  /** Returns a paginated and filtered list of active sessions for current account. */
  getSessions(params?: GetSessionsParams): Promise<AppResult<PagedResult<UserSession>, AppError>>

  /** Returns details of a specific session. */
  getSession(userSessionId: UserSessionId): Promise<AppResult<UserSession, AppError>>

  /** Ends current active session on server. */
  logout(): Promise<AppResult<void, AppError>>

  /** Deletes a specific active session. */
  deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>>

  /** Deletes all sessions except the current active session. */
  deleteAllOtherSessions(): Promise<AppResult<void, AppError>>

  /** Performs re-authentication via TOTP for current session. */
  reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>>
}
