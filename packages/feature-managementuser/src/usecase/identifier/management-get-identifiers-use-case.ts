import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifier,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'

/** Options object for filtering administrative user identifiers retrieval. */
export interface ManagementGetIdentifiersParams {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: UserSortValues.UserIdentifierSortBy | null
  sortOrder?: SortOrder | null
  userIds?: string[] | null
  userAuthProviders?: UserAuthProvider[] | null
  identifiers?: string[] | null
}

/** Administrative retrieval of user identity identifiers based on filters. */
export class ManagementGetIdentifiersUseCase {
  /**
   * Constructs a new {@link ManagementGetIdentifiersUseCase}.
   *
   * @param managementIdentifierRepository - Administrative identifier management repository
   */
  public constructor(private readonly managementIdentifierRepository: ManagementIdentifierRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Query and filter parameters
   * @returns Paginated result containing matching user identifier models, or a mapped failure
   */
  public async execute(
    params?: ManagementGetIdentifiersParams
  ): Promise<AppResult<PagedResult<UserIdentifier>, AppError>> {
    return this.managementIdentifierRepository.getIdentifiers(
      params?.pageNumber,
      params?.pageSize,
      params?.sortBy,
      params?.sortOrder,
      params?.userIds,
      params?.userAuthProviders,
      params?.identifiers
    )
  }
}
