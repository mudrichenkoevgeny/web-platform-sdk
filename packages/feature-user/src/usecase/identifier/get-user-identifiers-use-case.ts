import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierSummary
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
   * @param params - Self identifier list parameters
   * @returns PagedResult containing UserIdentifierSummary models or AppError
   */
  public async execute(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    return this.identifierRepository.getUserIdentifiers(params)
  }
}
