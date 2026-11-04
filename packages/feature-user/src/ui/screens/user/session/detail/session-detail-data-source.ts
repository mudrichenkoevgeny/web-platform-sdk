import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionId, UserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Interface representing a data source for session detail retrieval and actions.
 */
export interface SessionDetailDataSource {
  /** Fetches private details for a specific session. */
  getSession(sessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>>
  /** Optional method to revoke the session. */
  revokeSession?(sessionId: UserSessionId): Promise<AppResult<void, AppError>>
  /** Flag indicating whether session revocation is available. */
  isRevokeAvailable?: boolean
}

/** Dependencies required to construct a self-session {@link SessionDetailDataSource}. */
export interface SelfSessionDetailDataSourceDeps {
  getSessionUseCase: {
    execute(sessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>>
  }
  deleteSessionUseCase?: {
    execute(sessionId: UserSessionId): Promise<AppResult<void, AppError>>
  }
}

/**
 * Factory creating a {@link SessionDetailDataSource} for self-session operations.
 *
 * @param deps - Self session detail data source dependencies.
 * @returns Configured SessionDetailDataSource instance.
 */
export const createSelfSessionDetailDataSource = (
  deps: SelfSessionDetailDataSourceDeps
): SessionDetailDataSource => ({
  getSession: (sessionId) => deps.getSessionUseCase.execute(sessionId),
  revokeSession: deps.deleteSessionUseCase
    ? (sessionId) => deps.deleteSessionUseCase!.execute(sessionId)
    : undefined,
  isRevokeAvailable: Boolean(deps.deleteSessionUseCase)
})

/** Dependencies required to construct a management session {@link SessionDetailDataSource}. */
export interface ManagementSessionDetailDataSourceDeps {
  managementGetSessionUseCase: {
    execute(sessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>>
  }
  managementDeleteSessionUseCase?: {
    execute(sessionId: UserSessionId): Promise<AppResult<void, AppError>>
  }
}

/**
 * Factory creating a {@link SessionDetailDataSource} for management session operations.
 *
 * @param deps - Management session detail data source dependencies.
 * @returns Configured SessionDetailDataSource instance.
 */
export const createManagementSessionDetailDataSource = (
  deps: ManagementSessionDetailDataSourceDeps
): SessionDetailDataSource => ({
  getSession: (sessionId) => deps.managementGetSessionUseCase.execute(sessionId),
  revokeSession: deps.managementDeleteSessionUseCase
    ? (sessionId) => deps.managementDeleteSessionUseCase!.execute(sessionId)
    : undefined,
  isRevokeAvailable: Boolean(deps.managementDeleteSessionUseCase)
})
