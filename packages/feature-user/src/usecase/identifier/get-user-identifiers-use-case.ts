import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifierSummary,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { IdentifierRepository } from '@/repository/identifier/identifier-repository'

/** Returns a paginated and filtered list of identifiers for current account. */
export class GetUserIdentifiersUseCase {
  /**
   * Constructs a new {@link GetUserIdentifiersUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Fetches user identifiers list.
   *
   * @returns PagedResult containing UserIdentifierSummary models or AppError
   */
  public async execute(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    return this.identifierRepository.getUserIdentifiers(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      userAuthProviders,
      identifiers
    )
  }
}
