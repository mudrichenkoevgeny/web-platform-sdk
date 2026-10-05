import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionRepository } from '@/repository/session/SessionRepository'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'

/** Returns a paginated and filtered list of active sessions for current account. */
export class GetSessionsUseCase {
  /**
   * Constructs a new {@link GetSessionsUseCase}.
   *
   * @param sessionRepository - Session repository
   */
  public constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Fetches active sessions list.
   *
   * @returns PagedResult containing UserSession models or AppError
   */
  public async execute(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserSessionSortBy | null,
    sortOrder?: SortOrder | null,
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
    return this.sessionRepository.getSessions(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
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
  }
}
