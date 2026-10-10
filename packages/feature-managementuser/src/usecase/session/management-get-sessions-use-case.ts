import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserRole,
  UserSessionSummary,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'

/** Options object for filtering administrative user sessions retrieval. */
export interface ManagementGetSessionsParams {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: UserSortValues.UserSessionSortBy | null
  sortOrder?: SortOrder | null
  userIds?: string[] | null
  userRoles?: UserRole[] | null
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

/** Administrative retrieval of user sessions based on filters. */
export class ManagementGetSessionsUseCase {
  /**
   * Constructs a new {@link ManagementGetSessionsUseCase}.
   *
   * @param managementSessionRepository - Administrative session management repository
   */
  public constructor(private readonly managementSessionRepository: ManagementSessionRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Query and filter parameters
   * @returns Paginated result containing matching user session summary models, or a mapped failure
   */
  public async execute(
    params?: ManagementGetSessionsParams
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    return this.managementSessionRepository.getSessions(
      params?.pageNumber,
      params?.pageSize,
      params?.sortBy,
      params?.sortOrder,
      params?.userIds,
      params?.userRoles,
      params?.identifiers,
      params?.identifierIds,
      params?.userAuthProviders,
      params?.clientTypes,
      params?.userAgents,
      params?.ipAddresses,
      params?.languages,
      params?.deviceIds,
      params?.deviceNames,
      params?.appVersions,
      params?.operationSystemVersions
    )
  }
}
