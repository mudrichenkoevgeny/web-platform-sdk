import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalSessionListParams,
  PagedResult,
  SelfSessionListParams,
  UserId,
  UserSessionId,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Structured query input representing current session list query parameters.
 */
export interface SessionListQuery {
  pageNumber: number
  userId?: string | null
}

/**
 * Interface representing a data source for session listing and revocation actions.
 */
export interface SessionListDataSource {
  /** Fetches a paginated list of user sessions. */
  getSessions(
    query: SessionListQuery
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>>
  /** Optional method to revoke a specific session. */
  revokeSession?(sessionId: UserSessionId, userId?: UserId | null): Promise<AppResult<void, AppError>>
  /** Optional method to revoke all other sessions. */
  revokeAllOtherSessions?(): Promise<AppResult<void, AppError>>
  /** Flag indicating whether single session revocation is available. */
  isRevokeAvailable?: boolean
  /** Flag indicating whether revoking all other sessions is available. */
  isRevokeAllOthersAvailable?: boolean
}

/** Dependencies required to construct a self-session {@link SessionListDataSource}. */
export interface SelfSessionListDataSourceDeps {
  getSessionsUseCase: {
    execute(
      params?: SelfSessionListParams | null
    ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>>
  }
  deleteSessionUseCase?: {
    execute(userSessionId: UserSessionId): Promise<AppResult<void, AppError>>
  }
  deleteAllOtherSessionsUseCase?: {
    execute(): Promise<AppResult<void, AppError>>
  }
}

/**
 * Factory creating a {@link SessionListDataSource} for self-session operations.
 *
 * @param deps - Self session list data source dependencies.
 * @returns Configured SessionListDataSource instance.
 */
export const createSelfSessionListDataSource = (
  deps: SelfSessionListDataSourceDeps
): SessionListDataSource => ({
  getSessions: (query) =>
    deps.getSessionsUseCase.execute({ pageNumber: query.pageNumber }),
  revokeSession: deps.deleteSessionUseCase
    ? (sessionId) => deps.deleteSessionUseCase!.execute(sessionId)
    : undefined,
  revokeAllOtherSessions: deps.deleteAllOtherSessionsUseCase
    ? () => deps.deleteAllOtherSessionsUseCase!.execute()
    : undefined,
  isRevokeAvailable: Boolean(deps.deleteSessionUseCase),
  isRevokeAllOthersAvailable: Boolean(deps.deleteAllOtherSessionsUseCase)
})

/** Dependencies required to construct a management session {@link SessionListDataSource}. */
export interface ManagementSessionListDataSourceDeps {
  managementGetSessionsUseCase: {
    execute(
      params?: ManagementGlobalSessionListParams | null
    ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>>
  }
  managementDeleteSessionUseCase?: {
    execute(userId: UserId, sessionId: string): Promise<AppResult<void, AppError>>
  }
  managementDeleteAllUserSessionsUseCase?: {
    execute(userId: string): Promise<AppResult<void, AppError>>
  }
}

/**
 * Factory creating a {@link SessionListDataSource} for management session operations.
 *
 * @param deps - Management session list data source dependencies.
 * @returns Configured SessionListDataSource instance.
 */
export const createManagementSessionListDataSource = (
  deps: ManagementSessionListDataSourceDeps
): SessionListDataSource => ({
  getSessions: (query) =>
    deps.managementGetSessionsUseCase.execute({
      pageNumber: query.pageNumber,
      userIds: query.userId ? [query.userId] : undefined
    }),
  revokeSession: deps.managementDeleteSessionUseCase
    ? (sessionId, userId) =>
        deps.managementDeleteSessionUseCase!.execute(userId ?? ('' as UserId), sessionId)
    : undefined,
  revokeAllOtherSessions: deps.managementDeleteAllUserSessionsUseCase
    ? () => deps.managementDeleteAllUserSessionsUseCase!.execute('')
    : undefined,
  isRevokeAvailable: Boolean(deps.managementDeleteSessionUseCase),
  isRevokeAllOthersAvailable: Boolean(deps.managementDeleteAllUserSessionsUseCase)
})
