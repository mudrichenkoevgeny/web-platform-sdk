import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
import { toUserSession } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionApi } from '@/network/api/session/management-session-api'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'

/**
 * Implementation of {@link ManagementSessionRepository}.
 */
export class ManagementSessionRepositoryImpl implements ManagementSessionRepository {
  /**
   * Constructs a new {@link ManagementSessionRepositoryImpl}.
   *
   * @param managementSessionApi - Network API source
   */
  public constructor(private readonly managementSessionApi: ManagementSessionApi) {}

  public async getSessions(
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
  ): Promise<AppResult<PagedResult<UserSession>, AppError>> {
    const result = await this.managementSessionApi.getSessions(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      userIds,
      userRoles,
      identifiers,
      identifierIds,
      userAuthProviders,
      clientTypes,
      userAgents,
      ipAddresses,
      languages,
      deviceIds,
      deviceNames,
      appVersions,
      operationSystemVersions
    )
    return mapSuccess(result, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) => toUserSession(payload))
    }))
  }

  public async getSession(sessionId: string): Promise<AppResult<UserSession, AppError>> {
    const result = await this.managementSessionApi.getSession(sessionId)
    return mapSuccess(result, (payload) => toUserSession(payload))
  }

  public async deleteSession(userId: UserId, sessionId: string): Promise<AppResult<void, AppError>> {
    return this.managementSessionApi.deleteSession(userId, sessionId)
  }

  public async deleteAllUserSessions(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.managementSessionApi.deleteAllUserSessions(userId)
  }
}
